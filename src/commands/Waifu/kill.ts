import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from 'discord.js';
import Command from "../../interfaces/Command";
import axios from 'axios';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

import { getWaifu } from '../../utils/Waifu';


export const command: Command = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Kill someone!')
        .addUserOption(option => option.setName('user').setDescription('The user to kill').setRequired(true)),
    async execute(interaction: CommandInteraction) {

        const waifu = await getWaifu('kill');

        const embed = new MessageEmbed()
            .setTitle(`Kill`)
            .setDescription(`${interaction.user} is killing ${interaction.options.getUser('user')}!`)
            .setImage(waifu as string)
            .setColor('AQUA')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
} as Command;