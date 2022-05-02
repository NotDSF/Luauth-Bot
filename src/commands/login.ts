import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
    execute: () => {},
    Data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Login using your API Key")
        .addStringOption(option => option.setName("api_key").setRequired(true).setDescription("Your api key"))
}