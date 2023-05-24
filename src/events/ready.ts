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

    mongoose.connect(process.env.MONGO_URI as string);

    client.user?.setActivity("goddessanime.com", { type: "WATCHING" });


    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));

    db.once("open", () => {
      logger.info("Connected to MongoDB");
    });

    webServer();

  },
};
