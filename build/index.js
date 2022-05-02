"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var Discord = __importStar(require("discord.js"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var fs_1 = require("fs");
var log_1 = require("./modules/log");
var rest_1 = require("@discordjs/rest");
var v9_1 = require("discord-api-types/v9");
var path_1 = require("path");
var types_1 = require("./modules/types");
var logger = new log_1.Logger("MAIN");
var client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});
var Commands = new Map();
var SlashCommands = [];
var Selected = new Map();
var Authorized = require("../SavedKeys.json");
var config = require("../config.json");
function ReadDirectory(name) {
    var _this = this;
    fs_1.readdirSync(path_1.join(__dirname, name)).forEach(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var stat, command;
        return __generator(this, function (_a) {
            stat = fs_1.lstatSync(path_1.join(__dirname, name + "/" + file));
            if (stat.isDirectory()) {
                return [2 /*return*/, ReadDirectory(name + "/" + file)];
            }
            if (file.split(".").pop() === "js") {
                command = require(path_1.join(__dirname, name + "/" + file));
                Commands.set(command.Data.name, command);
                SlashCommands.push(command.Data.toJSON());
            }
            return [2 /*return*/];
        });
    }); });
}
ReadDirectory("commands");
var rest = new rest_1.REST({ version: "9" }).setToken(config.token);
client.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var er_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(config.activity);
                logger.log("Application ready");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                // @ts-ignore
                return [4 /*yield*/, rest.put(v9_1.Routes.applicationCommands(config.applicationId), { body: SlashCommands })];
            case 2:
                // @ts-ignore
                _b.sent();
                logger.log("Loaded slash commands");
                return [3 /*break*/, 4];
            case 3:
                er_1 = _b.sent();
                logger.error(er_1.toString());
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var CommandData, User, ApiKey, Response_1, Embed_1, Embed, Embed, Embed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isCommand() || !interaction.inGuild())
                    return [2 /*return*/];
                CommandData = Commands.get(interaction.commandName);
                if (!CommandData)
                    return [2 /*return*/];
                User = interaction.member;
                if (!(interaction.commandName === "login")) return [3 /*break*/, 5];
                ApiKey = interaction.options.getString("api_key", true);
                return [4 /*yield*/, node_fetch_1.default("https://api.luauth.xyz/v2/keys/" + ApiKey + "/details")];
            case 1:
                Response_1 = _a.sent();
                if (!(Response_1.status !== 200)) return [3 /*break*/, 3];
                Embed_1 = types_1.FedEmbed()
                    .setDescription("This api key is invalid!")
                    .setColor("#ff6c6c");
                return [4 /*yield*/, interaction.reply({ embeds: [Embed_1], ephemeral: true })];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                Authorized.Keys[User.id] = ApiKey;
                fs_1.writeFileSync(path_1.join(__dirname, "../SavedKeys.json"), JSON.stringify(Authorized, null, 4));
                Embed = types_1.FedEmbed()
                    .setDescription("Successfully logged in!");
                return [4 /*yield*/, interaction.reply({ embeds: [Embed], ephemeral: true })];
            case 4: return [2 /*return*/, _a.sent()];
            case 5:
                if (!(CommandData.AuthRequired && !Authorized.Keys[User.id])) return [3 /*break*/, 7];
                Embed = types_1.FedEmbed()
                    .setDescription("You don't have an api key linked, link one using the `/login` command!")
                    .setColor("#ff6c6c");
                return [4 /*yield*/, interaction.reply({ embeds: [Embed], ephemeral: true })];
            case 6: return [2 /*return*/, _a.sent()];
            case 7:
                if (!(CommandData.ScriptRequired && !Selected.get(interaction.user.id))) return [3 /*break*/, 9];
                Embed = types_1.FedEmbed()
                    .setDescription("You don't have a script selected, select one using the `/scripts` command!")
                    .setColor("#ff6c6c");
                return [4 /*yield*/, interaction.reply({ embeds: [Embed], ephemeral: true })];
            case 8: return [2 /*return*/, _a.sent()];
            case 9:
                try {
                    CommandData.execute(interaction, Authorized.Keys[User.id], Selected.get(interaction.user.id));
                }
                catch (er) {
                    logger.error(er.toString());
                }
                return [2 /*return*/];
        }
    });
}); });
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var Response_2, Embed_2, ResponseJSON, Script, Embed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!interaction.isSelectMenu())
                    return [2 /*return*/];
                if (!(interaction.customId === "select")) return [3 /*break*/, 6];
                return [4 /*yield*/, node_fetch_1.default("https://api.luauth.xyz/v2/keys/" + Authorized.Keys[interaction.user.id] + "/details")];
            case 1:
                Response_2 = _a.sent();
                if (!(Response_2.status !== 200)) return [3 /*break*/, 3];
                Embed_2 = types_1.FedEmbed()
                    .setDescription("There was an error running this command. Try again later?")
                    .setColor("#ff6c6c");
                return [4 /*yield*/, interaction.reply({ embeds: [Embed_2], ephemeral: true })];
            case 2: return [2 /*return*/, _a.sent()];
            case 3: return [4 /*yield*/, Response_2.json()];
            case 4:
                ResponseJSON = _a.sent();
                Script = ResponseJSON.scripts.find(function (script) { return script.script_id == interaction.values[0]; });
                Embed = types_1.FedEmbed()
                    .setDescription("This script has been selected <@" + interaction.user.id + ">")
                    .addFields([
                    { name: "Name", value: "`" + Script.script_name + "`", inline: true },
                    { name: "Version", value: "`" + Script.script_version + "`", inline: true },
                    { name: "Platform", value: "`" + (Script.platform.substr(0, 1).toUpperCase() + Script.platform.substr(1)) + "`" }
                ])
                    .setFooter({ text: "SID - " + Script.script_id });
                return [4 /*yield*/, interaction.update({ embeds: [Embed], components: [] })];
            case 5:
                _a.sent();
                Selected.set(interaction.user.id, interaction.values[0]);
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
client.login(config.token);
