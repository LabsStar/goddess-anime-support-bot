import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

import { getWaifu } from '../../utils/Waifu';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption(option => option.setName('user').setDescription('The user to hug').setRequired(true)),
    async execute(interaction: CommandInteraction) {

        const waifu = await getWaifu('hug');

        const embed = new MessageEmbed()
            .setTitle(`Hug`)
            .setDescription(`${interaction.user} is hugging ${interaction.options.getUser('user')}!`)
            .setImage(waifu as string)
            .setColor('AQUA')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
} as Command;