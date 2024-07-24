"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const moment_1 = __importDefault(require("moment"));
const CreationDate_1 = __importDefault(require("./CreationDate"));
const date_fns_1 = require("date-fns");
function convertToEpoch(dateString) {
    // Parse the date string to a Date object
    const date = (0, date_fns_1.parse)(dateString, 'yyyy-MM-dd', new Date());
    // Get the Unix epoch time in milliseconds and convert to seconds
    const epochTimeInSeconds = (0, date_fns_1.getTime)(date) / 1000;
    return epochTimeInSeconds;
}
// Replace YOUR_TELEGRAM_BOT_TOKEN with your actual bot token
const token = process.env.BOT_TOKEN;
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    const createDate = new CreationDate_1.default();
    const data = createDate.func(chatId);
    const date = (0, moment_1.default)(parseInt((data * 1000).toString())).utc().format("YYYY-MM-DD");
    bot.sendMessage(chatId, date.toString());
});
bot.onText(/\/id (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const id = parseInt(match ? match[1] : '0');
    const createDate = new CreationDate_1.default();
    const data = createDate.func(id);
    const date = (0, moment_1.default)(parseInt((data * 1000).toString())).utc().format("YYYY-MM-DD");
    bot.sendMessage(chatId, date.toString());
});
bot.onText(/\/add (.+) (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const id = parseInt(match ? match[1] : '0');
    const joinDate = match ? convertToEpoch(match[2]) : 0;
    const createDate = new CreationDate_1.default();
    createDate.addDatapoint([id, joinDate]);
    bot.sendMessage(chatId, 'added');
});
