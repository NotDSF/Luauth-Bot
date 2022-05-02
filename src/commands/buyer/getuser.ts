import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { FedEmbed } from "../../modules/types"
import fetch from "node-fetch";

module.exports = {
    execute: async (interaction: CommandInteraction, ApiKey: string, ScriptID: string) => {
        const Identifier = interaction.options.getString("identifier", true);

        const Request = await fetch(`https://api.luauth.xyz/v2/whitelist/${ScriptID}/${Identifier}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                Authorization: ApiKey
            }
        });

        const Response = await Request.json();

        if (Request.status !== 200) {
            const Embed = FedEmbed()
            .setDescription(`${Response.message}, <@${interaction.user.id}>.`)
            .setColor("#ff9999");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        const Embed = FedEmbed()
        .setTitle("User Details")
        .addField("Identifier", `\`${Response.identifier}\``)
        .addField("Whitelisted", `\`${Response.whitelisted}\``)

        const compontent = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("remove")
                .setLabel("Remove Whitelist")
                .setStyle("DANGER")
        );

        await interaction.reply({ embeds: [Embed], ephemeral: true, components: [compontent] });

        // @ts-ignore
        const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.customId == "remove" && i.user.id == interaction.user.id , time: 15000 });
        collector.on("collect", async (i) => {
            const WhitelistRequest = await fetch(`https://api.luauth.xyz/v2/whitelist/${ScriptID}/${Response.identifier}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    Authorization: ApiKey
                }
            });
            
            if (WhitelistRequest.status == 429) {
                const Embed = FedEmbed()
                .setDescription("You have exceeded your 30 requests per minute! Try again later")
                .setColor("#ff9999");
                await i.update({ embeds: [Embed] });
                return;
            }
    
            const WhitelistResponse = await WhitelistRequest.json();
            const Embed = FedEmbed()
            .setDescription(`${WhitelistResponse.message} <@${interaction.user.id}>.`)
            .setColor(Response.success ? "#99ff99" : "#ff9999");
            await i.update({ embeds: [Embed] });
        });
    },
    AuthRequired: true,
    ScriptRequired: true,
    Data: new SlashCommandBuilder()
        .setName("getuser")
        .setDescription("Get details of a specific user")
        .addStringOption(option => option.setName("identifier").setRequired(true).setDescription("Identifier of the user. Could be a HWID, IPv6, IPv4."))
}