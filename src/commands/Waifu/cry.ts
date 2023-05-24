import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

import { getWaifu } from '../../utils/Waifu';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('cry')
        .setDescription('Let it all out!'),
    async execute(interaction: CommandInteraction) {

        const waifu = await getWaifu('cry');

        const embed = new MessageEmbed()
            .setTitle(`Cry`)
            .setDescription(`${interaction.user} is crying!`)
            .setImage(waifu as string)
            .setColor('AQUA')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
} as Command;