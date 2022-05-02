"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var builders_1 = require("@discordjs/builders");
var discord_js_1 = require("discord.js");
var types_1 = require("../../modules/types");
var node_fetch_1 = __importDefault(require("node-fetch"));
module.exports = {
    execute: function (interaction, ApiKey) { return __awaiter(void 0, void 0, void 0, function () {
        var Request, Embed, Response, Selected, _loop_1, _i, _a, _b, i, v, row;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default("https://api.luauth.xyz/v2/keys/" + ApiKey + "/details")];
                case 1:
                    Request = _c.sent();
                    if (!(Request.status !== 200)) return [3 /*break*/, 3];
                    Embed = types_1.FedEmbed()
                        .setDescription("This api key is invalid, <@" + interaction.user.id + ">.")
                        .setColor("#ff6c6c");
                    return [4 /*yield*/, interaction.reply({ embeds: [Embed], ephemeral: true })];
                case 2: return [2 /*return*/, _c.sent()];
                case 3: return [4 /*yield*/, Request.json()];
                case 4:
                    Response = _c.sent();
                    Selected = [];
                    _loop_1 = function (i, v) {
                        Selected.push({
                            // @ts-ignore
                            label: v.script_name,
                            // @ts-ignore
                            value: v.script_id,
                            // @ts-ignore
                            description: v.script_id,
                            // @ts-ignore
                            emoji: interaction.guild.emojis.cache.find(function (e) { return e.name === v.platform; })
                        });
                    };
                    for (_i = 0, _a = Object.entries(Response.scripts); _i < _a.length; _i++) {
                        _b = _a[_i], i = _b[0], v = _b[1];
                        _loop_1(i, v);
                    }
                    row = new discord_js_1.MessageActionRow()
                        .addComponents(new discord_js_1.MessageSelectMenu()
                        .setCustomId("select")
                        .setPlaceholder("Select a script")
                        .addOptions(Selected));
                    return [4 /*yield*/, interaction.reply({ components: [row], ephemeral: true })];
                case 5:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    AuthRequired: true,
    Data: new builders_1.SlashCommandBuilder()
        .setName("scripts")
        .setDescription("Retrieves all your scripts and allows you to select a specific one to manage")
};
