import { Client, MessageEmbed, MessageActionRow, MessageButton, Interaction, CommandInteraction, ButtonInteraction, SelectMenuInteraction, MessageSelectMenu } from "discord.js";
import CustomClient from "../interfaces/CustomClient";
import config from "../config";
import Tickets from "../utils/tickets";
import IUser from "../interfaces/User";
import logger from "../utils/logger";

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction: Interaction, client: CustomClient) {
    const tickets = new Tickets(interaction.client);

    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      try {
        await command?.execute(interaction as CommandInteraction);
      } catch (error) {
        console.error(error);

        const errorEmbed = new MessageEmbed()
          .setTitle(`Command Error - ${interaction.commandName}`)
          .setDescription(`There was an error while executing this command!`)
          .setColor("RED")
          .setTimestamp();
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    } else if (interaction.isButton()) {
      const button = interaction.component;

      if (button instanceof MessageButton) {

        if (button.customId === "delete_ticket") {
          await interaction.reply({ content: await tickets.deleteTicket(interaction.channel, interaction.user as IUser), ephemeral: true });
        } else if (button.customId === "close_ticket") {
          await interaction.reply({ content: await tickets.closeTicket(interaction.channel, interaction.user as IUser), ephemeral: true });
        }

      }
    }
    else if (interaction.isSelectMenu()) {
      const menu = interaction.component;

      if (menu instanceof MessageSelectMenu) {

        if (menu.customId === "ticket_category") {
          const user = interaction.user as IUser;
          const ticket_category = interaction.values[0];


          await interaction.reply({ content: await tickets.createTicket(user, ticket_category), ephemeral: true });
        }

        if (menu.customId === "self_roles") {
          const user = interaction.user as IUser;
          const role = interaction.values[0];
          const role_data = interaction.guild?.roles.cache.find(r => r.id === role);

          const guild = client.guilds.cache.get(process.env.GUILD_ID as string);

          const member = await guild?.members.fetch(user.id);

          if (member?.roles.cache.has(role)) {
            await member?.roles.remove(role);
            await interaction.reply({ content: `Removed <@&${role}>`, ephemeral: true });
            logger.info(`Removed ${role_data?.name} from ${user.username}#${user.discriminator}`);
          }
          else {
            await member?.roles.add(role);
            await interaction.reply({ content: `Added <@&${role}>`, ephemeral: true });
            logger.info(`Added ${role_data?.name} to ${user.username}#${user.discriminator}`);
          }

        }

      }
    }

  },
};
