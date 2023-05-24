import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';

const sleep = promisify(setTimeout);


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Get a random cat image'),
    async execute(interaction: CommandInteraction) {

        const text = interaction.options.getString('text');

        const url = `https://cataas.com/cat`;

        const embed = new MessageEmbed()
            .setTitle('Cat')
            .setImage(url)
            .setColor('AQUA')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
} as Command;