import { bot } from './bot';
import CreationDate from './CreationDate';
import moment from 'moment';
import TelegramBot from 'node-telegram-bot-api';
import {
    convertToEpoch,
    calculateDays
} from './utils';
import {
    PREMIUM_BONUS_POINTS,
    OG_BONUS_POINTS,
    OG_THRESHOLD_DAYS,
    START_TIME,
    MULTIPLE,
    FAQ
} from './constants';

const MAIN_MENU_OPTIONS = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Check Account Age', callback_data: 'check' }],
            [{ text: 'Input real data', callback_data: 'input' }],
            [{ text: 'How to add real data', callback_data: 'faq' }],
        ]
    }
}

export async function handleShowMainMenu(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Check now 👇', MAIN_MENU_OPTIONS);
}

export async function handleCheckAge(msg: TelegramBot.Message, id: number) {
    const chatId = msg.chat.id;

    const createDate = new CreationDate();
    const data = createDate.func(id);
    const date = moment(parseInt((data * 1000).toString())).utc().format("YYYY-MM-DD");
    await bot.sendMessage(chatId, `Your registered date: ${date.toString()}`);

    const days = calculateDays(data * 1000);

    await handleShowMainMenu(msg);
}

export async function handleAddData(msg: TelegramBot.Message, id: number, registeredDate: string) {
    const chatId = msg.chat.id;
    const joinDate = convertToEpoch(registeredDate);

    const createDate = new CreationDate();
    createDate.addDatapoint([id, joinDate]);
    await bot.sendMessage(chatId, 'added');
    await handleShowMainMenu(msg);
}

export async function handleFaq(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, FAQ);
    await handleShowMainMenu(msg);
}