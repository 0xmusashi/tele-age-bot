import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
dotenv.config();
import moment from 'moment';
import CreationDate from './CreationDate';
import { parse, getTime } from 'date-fns';

function convertToEpoch(dateString: string): number {
    // Parse the date string to a Date object
    const date = parse(dateString, 'yyyy-MM-dd', new Date());

    // Get the Unix epoch time in milliseconds and convert to seconds
    const epochTimeInSeconds = getTime(date) / 1000;

    return epochTimeInSeconds;
}

// Replace YOUR_TELEGRAM_BOT_TOKEN with your actual bot token
const token = <string>process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;

    const createDate = new CreationDate();
    const data = createDate.func(chatId);
    const date = moment(parseInt((data * 1000).toString())).utc().format("YYYY-MM-DD");
    bot.sendMessage(chatId, date.toString());
});

bot.onText(/\/id (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const id = parseInt(match ? match[1] : '0');

    const createDate = new CreationDate();
    const data = createDate.func(id);
    const date = moment(parseInt((data * 1000).toString())).utc().format("YYYY-MM-DD");
    bot.sendMessage(chatId, date.toString());
});

bot.onText(/\/add (.+) (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const id = parseInt(match ? match[1] : '0');
    const joinDate = match ? convertToEpoch(match[2]) : 0;

    const createDate = new CreationDate();
    createDate.addDatapoint([id, joinDate]);
    bot.sendMessage(chatId, 'added');
});
