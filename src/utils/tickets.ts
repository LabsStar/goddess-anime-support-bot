const { MessageEmbed, MessageActionRow, MessageButton, Client, Channel, GuildChannel } = require("discord.js");
const { TICKET_PARENT_ID, STAFF_ROLE_ID, GUILD_ID } = process.env;
import { Guild } from "discord.js";
import IUser from "../interfaces/User";

class Tickets {
    client: typeof Client;

    constructor(client: typeof Client) {
        this.client = client;
    }

    async createTicket(user: IUser, ticket_category: string) {
        const guild = this.client.guilds.cache.get(GUILD_ID);

        const ticketParent = guild.channels.cache.get(TICKET_PARENT_ID);

        const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);


        // Create a new channel
        const channel = await guild.channels.create(`ticket-${user.username}`, {
            type: "text",
            parent: ticketParent,
            topic: `Ticket for ${user.username}#${user.discriminator} (${user.id}) | Category: ${ticket_category.replace("_", " ").toUpperCase()}`,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"],
                },
                {
                    id: staffRole.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"],
                },
            ],
        });

        // Create a new embed
        const embed = new MessageEmbed()
            .setTitle(`Ticket for ${user.username}#${user.discriminator}`)
            .setDescription(`Ticket category: ${ticket_category.replace("_", " ").toUpperCase()}`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=1024`)
            .setColor("RANDOM")
            .setTimestamp();

        // Create a new row
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("close_ticket")
                    .setLabel("Close Ticket")
                    .setEmoji("🔒")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("delete_ticket")
                    .setLabel("Delete Ticket")
                    .setEmoji("🗑️")
                    .setStyle("DANGER"),
            );

        // Send the embed and row
        await channel.send({ embeds: [embed], components: [row] });

        // Send a message to the user
        return `Your ticket has been created! ${channel}`;

    }

    async closeTicket(channel: typeof GuildChannel, user: IUser) {
        const guild = this.client.guilds.cache.get(GUILD_ID);

        const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);

        //    Make sure the channel is a ticket
        if (channel.parentId !== TICKET_PARENT_ID) return "This channel is not a ticket!";

        // Make the permission overwrites
        const overwrites = [
            {
                id: guild.roles.everyone,
                deny: ["VIEW_CHANNEL"],
            },
            {
                id: staffRole.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"],
            },
            {
                id: user.id,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS", "ADD_REACTIONS"],
            },
        ];

        // Edit the channel
        setTimeout(async () => {
            await channel.edit({ permissionOverwrites: overwrites });
        }, 5000);

        const embed = new MessageEmbed()
            .setTitle(`Ticket Closed`)
            .setDescription(`This ticket has been closed by ${user.username}#${user.discriminator}`)
            .setColor("RANDOM")
            .setTimestamp();

        // Send the embed
        await channel.send({ embeds: [embed] });

        return `Ticket closed!`;
    }

    async deleteTicket(channel: typeof GuildChannel, user: IUser) {
        const guild = this.client.guilds.cache.get(GUILD_ID);

        const staffRole = guild.roles.cache.get(STAFF_ROLE_ID);


        if (channel.parentId !== TICKET_PARENT_ID) return "This channel is not a ticket!";

        setTimeout(async () => {
            channel.delete();
        }, 20000);



        const time = Math.floor(Date.now() / 1000) + 21;


        const embed = new MessageEmbed()
            .setTitle(`Ticket Deleted`)
            .setDescription(`This ticket has been deleted by ${user.username}#${user.discriminator}\n\nThis ticket will be deleted <t:${time}:R>`)
            .setColor("RANDOM")
            .setTimestamp();

        // Send the embed
        await channel.send({ embeds: [embed], content: `<@&${STAFF_ROLE_ID}>` });

        return `Ticket deleted!`;
    }

}

export default Tickets;