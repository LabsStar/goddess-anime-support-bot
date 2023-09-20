import { Client } from "discord.js";
import mongoose from "mongoose";
import logger from '../utils/logger';
import webServer from "../web/webServer";

module.exports = {
  name: "ready",
  once: true,
  async execute(client: Client) {

    console.clear();
    logger.info(`Logged in as ${client.user?.tag}!`);

    // mongoose.connect(process.env.MONGO_URI as string);

    client.user?.setActivity("hyperstar.live", { type: "WATCHING" });

    webServer();

  },
};
