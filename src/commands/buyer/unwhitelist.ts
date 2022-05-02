import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { FedEmbed } from "../../modules/types"
import fetch from "node-fetch";

module.exports = {
    execute: async (interaction: CommandInteraction, ApiKey: string, ScriptID: string) => {
        const Identifier = interaction.options.getString("identifier", true);

        const Request = await fetch(`https://api.luauth.xyz/v2/whitelist/${ScriptID}/${Identifier}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                Authorization: ApiKey
            }
        });

        if (Request.status == 429) {
            const Embed = FedEmbed()
            .setDescription("You have exceeded your 30 requests per minute! Try again later")
            .setColor("#ff6c6c");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        const Response = await Request.json();
        const Embed = FedEmbed()
        .setDescription(`${Response.message} <@${interaction.user.id}>.`)
        .setColor(Response.success ? "#99ff99" : "#ff6c6c");
        await interaction.reply({ embeds: [Embed] });
    },
    AuthRequired: true,
    ScriptRequired: true,
    Data: new SlashCommandBuilder()
        .setName("unwhitelist")
        .setDescription("Remove a whitelisted user")
        .addStringOption(option => option.setName("identifier").setRequired(true).setDescription("Identifier of the user to remove. Could be a HWID, IPv6, IPv4."))
}