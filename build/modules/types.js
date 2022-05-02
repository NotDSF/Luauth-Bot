"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMember = exports.CommandInteraction = exports.Message = exports.FedEmbed = void 0;
var discord_js_1 = require("discord.js");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return discord_js_1.Message; } });
Object.defineProperty(exports, "CommandInteraction", { enumerable: true, get: function () { return discord_js_1.CommandInteraction; } });
Object.defineProperty(exports, "GuildMember", { enumerable: true, get: function () { return discord_js_1.GuildMember; } });
var config = require("../../config.json");
// Automatically implements the default embed values (such as title, color and footer)
function FedEmbed() {
    var Embed = new discord_js_1.MessageEmbed()
        .setTitle(config.embeds.default_title)
        // @ts-ignore
        .setColor(config.embeds.success_color)
        .setTimestamp()
        .setFooter({ text: config.embeds.defualt_footer });
    return Embed;
}
exports.FedEmbed = FedEmbed;
