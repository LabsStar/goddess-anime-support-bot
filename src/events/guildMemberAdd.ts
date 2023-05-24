import { Client, MessageEmbed, MessageButton, MessageActionRow, TextChannel } from "discord.js";
import logger from '../utils/logger';
import config from "../config";

const { MEMBER_ROLE, WELCOME_CHANNEL, RULES_CHANNEL, ROLES_CHANNEL } = config;

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member: any, client: Client) {

    const message = `Welcome to ${member.guild.name}, <@!${member.id}>! \n\n Please read the rules in <#${RULES_CHANNEL}> and get your roles in <#${ROLES_CHANNEL}>! \n\n Enjoy your stay!`;

    const embed = new MessageEmbed()
        .setTitle(`Welcome to ${member.guild.name}!`)
        .setDescription(message)
        .setColor("#58b9ff")
        .setTimestamp()
        .setFooter({ text: `Welcome ${member.user.tag}!`, iconURL: member.user.displayAvatarURL({ dynamic: true }) });

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setURL('https://github.com/LabsStar/goddess-anime/')
                .setLabel('We are open source!')
                .setStyle('LINK'),
            new MessageButton()
                .setURL('https://goddessanime.com/?utm_source=discord&utm_medium=referral&utm_campaign=welcome')
                .setLabel('Visit our website!')
                .setStyle('LINK'),
        );

        member.roles.add(MEMBER_ROLE as string);

        const channel = client.channels.cache.get(WELCOME_CHANNEL as string) as TextChannel;

        if (!channel) throw new Error("Channel not found");

        await channel.send({ embeds: [embed], components: [row], content: `<@!${member.id}>` });
        
        

  },
};
