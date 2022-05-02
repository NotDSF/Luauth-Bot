"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builders_1 = require("@discordjs/builders");
module.exports = {
    execute: function () { },
    Data: new builders_1.SlashCommandBuilder()
        .setName("login")
        .setDescription("Login using your API Key")
        .addStringOption(function (option) { return option.setName("api_key").setRequired(true).setDescription("Your api key"); })
};
