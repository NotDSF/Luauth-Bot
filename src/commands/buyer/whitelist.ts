import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { FedEmbed, ScriptInstance } from "../../modules/types"
import fetch from "node-fetch";

module.exports = {
    execute: async (interaction: CommandInteraction, ApiKey: string, ScriptID: string, ScriptCache: any) => {
        const Identifier = interaction.options.getString("identifier", true);
        const Expire = interaction.options.getNumber("expire") || 0;
        const Note = interaction.options.getString("note") || ""

        const Request = await fetch(`https://api.luauth.xyz/v2/whitelist/${ScriptID}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                Authorization: ApiKey
            },
            body: JSON.stringify({
                identifier: Identifier,
                auth_expire: Expire,
                note: Note
            })
        });

        if (Request.status == 429) {
            const Embed = FedEmbed()
            .setDescription("You have exceeded your 30 requests per minute! Try again later")
            .setColor("#ff9999");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        const Response = await Request.json();
        const Embed = FedEmbed()
        .setDescription(`${Response.message} <@${interaction.user.id}>`)
        .setColor(Response.success ? "#99ff99" : "#ff9999");

        const Script = ScriptCache.find((a: ScriptInstance) => a.script_id === ScriptID);
        // modern problems require modern solutions
        if (Response.success) {
            Embed.addFields([
                { name: "Note", value: `\`${Note.length ? Note : "No note was specified"}\`` },
                { name: "Script Name", value: `\`${Script.script_name}\`` },
            ]);
        }

        await interaction.reply({ embeds: [Embed] });
    },
    AuthRequired: true,
    ScriptRequired: true,
    Data: new SlashCommandBuilder()
        .setName("whitelist")
        .setDescription("Whitelists a user")
        .addStringOption(option => option.setName("identifier").setRequired(true).setDescription("Identifier of the user to whitelist. Could be a HWID, IPv6, IPv4."))
        .addNumberOption(option => option.setName("expiry").setDescription("Unix timestamp (seconds) of expiry date. (GMT+1) (0 for forever)").setMaxValue(2147483647))
        .addStringOption(option => option.setName("note").setDescription("Custom note for client. This might make it easier to identify the user."))
}