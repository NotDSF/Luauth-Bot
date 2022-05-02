import * as Discord from "discord.js";
import fetch from "node-fetch";
import { readdirSync, lstatSync, writeFileSync } from "fs";
import { Logger } from "./modules/log";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { join } from "path";
import { Command, FedEmbed, KeyResponse, ScriptInstance } from "./modules/types";

const logger = new Logger("MAIN");
const client = new Discord.Client({ 
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] 
});

let Commands = new Map();
let SlashCommands: any = [];
let Selected = new Map();
let Authorized = require("../SavedKeys.json");
let config = require("../config.json");

function ReadDirectory(name: string) {
    readdirSync(join(__dirname, name)).forEach(async file => {
        const stat = lstatSync(join(__dirname, `${name}/${file}`));
        if (stat.isDirectory()) {
            return ReadDirectory(`${name}/${file}`);
        }

        if (file.split(".").pop() === "js") {
            const command = require(join(__dirname, `${name}/${file}`));
            Commands.set(command.Data.name, command);
            SlashCommands.push(command.Data.toJSON());
        }
    });
}

ReadDirectory("commands");

const rest = new REST({ version: "9" }).setToken(config.token);

client.on("ready", async () => {
    client.user?.setActivity(config.activity);
    logger.log("Application ready");

    try {
        // @ts-ignore
        await rest.put(Routes.applicationCommands(config.applicationId), { body: SlashCommands });
        logger.log("Loaded slash commands");
    } catch (er: any) {
        logger.error(er.toString());
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || !interaction.inGuild()) return;

    let CommandData: Command = Commands.get(interaction.commandName);
    if (!CommandData) return;

    let User: Discord.GuildMember = interaction.member as Discord.GuildMember;

    if (interaction.commandName === "login") {
        const ApiKey = interaction.options.getString("api_key", true);
        const Response = await fetch(`https://api.luauth.xyz/v2/keys/${ApiKey}/details`)

        if (Response.status !== 200) {
            const Embed = FedEmbed()
            .setDescription(`This api key is invalid!`)
            .setColor("#ff6c6c");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        Authorized.Keys[User.id] = ApiKey;
        writeFileSync(join(__dirname, "../SavedKeys.json"), JSON.stringify(Authorized, null, 4));

        const Embed = FedEmbed()
        .setDescription(`Successfully logged in!`)
        return await interaction.reply({ embeds: [Embed], ephemeral: true });
    }

    if (CommandData.AuthRequired && !Authorized.Keys[User.id]) {
        const Embed = FedEmbed()
        .setDescription(`You don't have an api key linked, link one using the \`/login\` command!`)
        .setColor("#ff6c6c");
        return await interaction.reply({ embeds: [Embed], ephemeral: true });
    }

    if (CommandData.ScriptRequired && !Selected.get(interaction.user.id)) {
        const Embed = FedEmbed()
        .setDescription(`You don't have a script selected, select one using the \`/scripts\` command!`)
        .setColor("#ff6c6c");
        return await interaction.reply({ embeds: [Embed], ephemeral: true });
    }

    try {
        CommandData.execute(interaction, Authorized.Keys[User.id], Selected.get(interaction.user.id));
    } catch (er: any) {
        logger.error(er.toString());   
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === "select") {
        const Response = await fetch(`https://api.luauth.xyz/v2/keys/${Authorized.Keys[interaction.user.id]}/details`)

        if (Response.status !== 200) {
            const Embed = FedEmbed()
            .setDescription("There was an error running this command. Try again later?")
            .setColor("#ff6c6c");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        const ResponseJSON: KeyResponse = await Response.json();
        let Script: any = ResponseJSON.scripts.find((script: ScriptInstance) => script.script_id == interaction.values[0]);
        
        const Embed = FedEmbed()
        .setDescription(`This script has been selected <@${interaction.user.id}>`)
        .addFields([
            { name: "Name", value: `\`${Script.script_name}\``, inline: true },
            { name: "Version", value: `\`${Script.script_version}\``, inline: true },
            { name: "Platform", value: `\`${ Script.platform.substr(0, 1).toUpperCase() + Script.platform.substr(1)}\`` }
        ])
        .setFooter({ text: `SID - ${Script.script_id}` });

        await interaction.update({ embeds: [Embed], components: [] });
        Selected.set(interaction.user.id, interaction.values[0]);
	}
});

client.login(config.token);