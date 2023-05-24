import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Ship two users together!')
        .addUserOption(option => option.setName('user2').setDescription('The second user to ship').setRequired(true))
        .addUserOption(option => option.setName('user1').setDescription('The first user to ship')),
    async execute(interaction: CommandInteraction) {

        const user1 = interaction.options.getUser('user1') ?? interaction.user;
        const user2 = interaction.options.getUser('user2');

        if (user1 === user2) return interaction.reply({ content: 'You need to specify two different users to ship!', ephemeral: true });
        if (!user2) return interaction.reply({ content: 'You need to specify a second user to ship!', ephemeral: true });

        const ship = Math.floor(Math.random() * 100) + 1;

        const ship_name = `${user1.username.slice(0, user1.username.length / 2)}${user2.username.slice(user2.username.length / 2)}`;

       
        const embed = new MessageEmbed()
            .setTitle(`Ship`)
            .setDescription(`${user1} and ${user2} are ${ship}% compatible!`)
            .addFields(
                { name: 'Ship Name', value: ship_name },
                { name: 'Ship Percentage', value: `${ship}%` }
            )
            .setImage("https://randomc.net/image/Kono%20Subarashii%20Sekai%20ni%20Shukufuku%20Wo/Kono%20Subarashii%20Sekai%20ni%20Shukufuku%20Wo%20-%2003%20-%20Large%2001.jpg")
            .setColor('RED')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
} as Command;