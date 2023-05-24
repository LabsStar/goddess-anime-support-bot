import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

import { getWaifu } from '../../utils/Waifu';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('blush')
        .setDescription('UwU, senpai~'),
    async execute(interaction: CommandInteraction) {

        const waifu = await getWaifu('blush');

        const embed = new MessageEmbed()
            .setTitle(`Blush`)
            .setDescription(`${interaction.user} is blushing!`)
            .setImage(waifu as string)
            .setColor('AQUA')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
} as Command;