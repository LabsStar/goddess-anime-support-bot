import { Client, MessageEmbed, MessageActionRow, MessageSelectMenu, Message, Channel, TextChannel, GuildMember } from "discord.js";
import CustomClient from "../interfaces/CustomClient";
import config from "../config";
import logger from "../utils/logger";
import Tickets from "../utils/tickets";
import IUser from "../interfaces/User";
import axios from "axios";

const { DEVELOPER_PREFIX, GITHUB_REPO_CONTRIBUTORS, SELF_ROLES } = config;


const supportServer = process.env.GUILD_ID;
const staffRole = process.env.STAFF_ROLE_ID;


module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message: Message, client: CustomClient) {
    const tickets = new Tickets(message.client);

    if (message.channel.type === "DM" && message.author.id !== client.user?.id) {
      return;
    }

    if (message.content.startsWith(DEVELOPER_PREFIX)) {
      const server = client.guilds.cache.get(supportServer as string);
      const member = await server?.members.fetch(message.author.id);
      if (!member?.roles.cache.has(staffRole as string)) {
        return;
      }

      const args = message.content.slice(DEVELOPER_PREFIX.length).trim().split(/ +/);


      const command = args.shift()?.toLowerCase();

      if (!command) return;

      if (command === "contributors") {
        const contributors = await axios.get(GITHUB_REPO_CONTRIBUTORS as string);

        const mapedWithIndex = contributors.data.map((contributor: any, index: number) => `${index + 1}. ${contributor.login} :: <${contributor.html_url}>`)

        message.channel.send({ content: mapedWithIndex.join("\n") });
      }

      if (command === "tickets") {
        const embed = new MessageEmbed()
          .setTitle(`Create a ticket`)
          .setDescription("Please choose a category for your ticket")
          .setImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKfVga7sUBlrAOeH38bljhL0p_0CL21-METQ&usqp=CAU")
          .setColor("RANDOM")
          .setTimestamp();

        const row = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId("ticket_category")
              .setPlaceholder("Select a category")
              .addOptions([
                {
                  label: "General Support",
                  description: "Need help with something? Ask here!",
                  value: "general_support",
                  emoji: "🔧",
                },
                {
                  label: "Contibuting Role",
                  description: "Have you contributed to the bot? Get your role here!",
                  value: "contibuting_role",
                  emoji: "👨‍💻",
                },
                {
                  label: "Bug Report",
                  description: "Found a bug? Report it here!",
                  value: "bug_report",
                  emoji: "🐛",
                },
                {
                  label: "Partnerships",
                  description: "Want to partner with us? Apply here!",
                  value: "partnerships",
                  emoji: "🤝",
                },
                {
                  label: "Other",
                  description: "Didn't find a category for your ticket? Choose this!",
                  value: "other",
                  emoji: "📁",
                }
              ])
          );

        await message.channel.send({ embeds: [embed], components: [row] });
      }

      if (command === "roles") {

        const embed = new MessageEmbed()
          .setTitle(`Self Roles`)
          .setDescription("Choose a role to add/remove")
          .setImage("https://live.staticflickr.com/65535/49750810283_c86900fc35_z.jpg")
          .setColor("AQUA")
          .setTimestamp();

        const options = SELF_ROLES.map((roleId) => ({
          label: `${server?.roles.cache.get(roleId)?.name}`,
          value: roleId,
          description: `Add/remove the ${server?.roles.cache.get(roleId)?.name} role`,
        }));

        const row = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId("self_roles")
              .setPlaceholder("Select a role")
              .addOptions(options)
          );

        await message.channel.send({ embeds: [embed], components: [row] });


      }
    }

  },
};
