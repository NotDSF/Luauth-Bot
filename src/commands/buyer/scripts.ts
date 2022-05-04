import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";
import { FedEmbed } from "../../modules/types"
import fetch from "node-fetch";

module.exports = {
    execute: async (interaction: CommandInteraction, ApiKey: string) => {
        const Request = await fetch(`https://api.luauth.xyz/v2/keys/${ApiKey}/details`)

        if (Request.status !== 200) {
            const Embed = FedEmbed()
            .setDescription(`This api key is invalid, <@${interaction.user.id}>.`)
            .setColor("#ff9999");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        const Response = await Request.json();
        if (!Response.scripts.length) {
            const Embed = FedEmbed()
            .setDescription(`You don't have any scripts, <@${interaction.user.id}>.`)
            .setColor("#ff9999");
            return await interaction.reply({ embeds: [Embed], ephemeral: true });
        }

        let Selected = [];

        for (let [i,v] of Object.entries(Response.scripts)) {
            Selected.push({
                // @ts-ignore
                label: v.script_name,
                // @ts-ignore
                value: v.script_id,
                // @ts-ignore
                description: v.script_id,
                // @ts-ignore
                emoji: interaction.guild.emojis.cache.find(e => e.name === v.platform)
            });
        }

        const row = new MessageActionRow()
        .addComponents(new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Select a script")
        .addOptions(Selected))

        await interaction.reply({ components: [row], ephemeral: true });
    },
    AuthRequired: true,
    Data: new SlashCommandBuilder()
        .setName("scripts")
        .setDescription("Retrieves all your scripts and allows you to select a specific one to manage")
}