import { MessageEmbed, Message, CommandInteraction, GuildMember } from "discord.js";
let config = require("../../config.json");

interface Command {
    name: string,
    execute: (interaction: CommandInteraction, ApiKey?: string, ScriptId?: string, ScriptCache?: any) => void,
    AuthRequired?: boolean,
    ScriptRequired?: boolean
}

interface ScriptInstance {
    script_id: string
}

interface KeyResponse {
    scripts: []
}

// Automatically implements the default embed values (such as title, color and footer)
function FedEmbed(): MessageEmbed {
    const Embed = new MessageEmbed()
    .setTitle(config.embeds.default_title)
    // @ts-ignore
    .setColor(config.embeds.success_color)
    .setTimestamp()
    .setFooter({ text: config.embeds.defualt_footer });
    
    return Embed;
}

export { Command, FedEmbed, Message, CommandInteraction, GuildMember, ScriptInstance, KeyResponse }