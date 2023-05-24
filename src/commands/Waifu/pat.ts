import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

import { getWaifu } from '../../utils/Waifu';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Being patted by is a good feeling!')
        .addUserOption(option => option.setName('user').setDescription('The user to pat').setRequired(true)),
    async execute(interaction: CommandInteraction) {

        const waifu = await getWaifu('pat');

        const embed = new MessageEmbed()
            .setTitle(`Pat`)
            .setDescription(`${interaction.user} is patting ${interaction.options.getUser('user')}!`)
            .setImage(waifu as string)
            .setColor('AQUA')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
} as Command;