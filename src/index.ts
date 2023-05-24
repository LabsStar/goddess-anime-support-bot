import { Client, Collection, Intents, TextBasedChannel } from 'discord.js';
import { config } from 'dotenv';
import CustomClient from './interfaces/CustomClient';
import Command from './interfaces/Command';
import { readdirSync } from 'fs';
import { join } from 'path';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    allowedMentions: { parse: ["users", "roles"], repliedUser: true },
}) as CustomClient;


client.commands = new Collection();
config();

const commandFolders = readdirSync(join(__dirname, "commands"));

for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, "commands", folder)).filter(file => file.endsWith(".ts"));
    for (const file of commandFiles) {
        const command = require(join(__dirname, "commands", folder, file));
        client.commands.set(command.command.data.name, command.command);
    }
}


const eventFiles = readdirSync(join(__dirname, "events")).filter(file => file.endsWith(".ts"));

for (const file of eventFiles) {
    const event = require(join(__dirname, "events", file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.token as string || "");