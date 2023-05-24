import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import Command from './interfaces/Command'; // Import the Command interface

config();

const commands: Array<Command['data']> = []; // Specify the type of the commands array

const commandFolders = readdirSync(join(__dirname, 'commands'));

for (const folder of commandFolders) {
  const commandFiles = readdirSync(join(__dirname, 'commands', folder)).filter((file) => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const { command } = require(join(__dirname, 'commands', folder, file)); // Destructure the command object
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(process.env.token as string || ''); // Set the token

const args = process.argv.slice(2);

const clientID = args[0] || '1111026177684029481';
const guildID = args[1] || '1110574418733838489';

if (!clientID) throw new Error('Please provide a client ID');
if (!guildID) {
  console.warn('No guild ID provided, registering global commands.');
  rest
    .put(Routes.applicationCommands(clientID), { body: commands })
    .then(() => {
      console.log('Successfully registered application commands. (GLOBAL)');
    })
    .catch(console.error);
} else {
  rest
    .put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
    .then(() => {
      console.log(`Successfully registered application commands. (GUILD: ${guildID})`);
    })
    .catch(console.error);
}
