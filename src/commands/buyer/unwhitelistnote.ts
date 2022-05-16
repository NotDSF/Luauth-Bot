import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { FedEmbed } from "../../modules/types"
import fetch from "node-fetch";

module.exports = {
    execute: async (interaction: CommandInteraction, ApiKey: string, ScriptID: string) => {
        const Note = interaction.options.getString("note", true);
        
        let Request = await fetch(`https://api.luauth.xyz/v2/whitelist/${ScriptID}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: ApiKey
            }
        });

        if (Request.status == 429) {
            const Embed = FedEmbed()
            .setDescription("You have exceeded your 30 requests per minute! Try again later")
            .setColor("#ff9999");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        const Response = await Request.json();
        let Unwhitelisted = 0;

        for (let user of Response.whitelisted_users) {
            if (user.note == Note) {
                Request = await fetch(`https://api.luauth.xyz/v2/whitelist/${ScriptID}/${user.identifier}`, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json",
                        Authorization: ApiKey
                    }
                })
                
                if (Request.status == 429) {
                    const Embed = FedEmbed()
                    .setDescription("You have exceeded your 30 requests per minute! Try again later")
                    .setColor("#ff9999");
                    return await interaction.reply({ embeds: [Embed], ephemeral: true });
                }

                Unwhitelisted++;
            }
        }

        const Embed = FedEmbed()
        .setDescription(`Unwhitelisted \`${Unwhitelisted}\` users <@${interaction.user.id}>.`)
        .setColor(Response.success ? "#99ff99" : "#ff9999");
        await interaction.reply({ embeds: [Embed] });
    },
    AuthRequired: true,
    ScriptRequired: true,
    Data: new SlashCommandBuilder()
        .setName("unwhitelistnote")
        .setDescription("Unwhitelists all user(s) with the specified note")
        .addStringOption(option => option.setName("note").setRequired(true).setDescription("Note to match when interating through all whitelisted users"))
}