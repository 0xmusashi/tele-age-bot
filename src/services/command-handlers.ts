import { bot } from '../bot';
import CreationDate from './CreationDate';
import moment from 'moment';
import TelegramBot from 'node-telegram-bot-api';
import { convertToEpoch, calculateDiffDays, cleanMessage, treeDisplay } from '../utils/utils';
import {
    PREMIUM_BONUS_POINTS,
    OG_BONUS_POINTS,
    OG_THRESHOLD_DAYS,
    START_TIME,
    MULTIPLE,
    FAQ,
    MESSAGES,
    LANGS,
    MessageLanguages,
} from '../constants/constants';
import RewardService from './reward.service';

const MAIN_MENU_OPTIONS = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Get Reward', callback_data: 'reward' }],
            [{ text: 'Check Account Age', callback_data: 'check' }],
            [{ text: 'Input real data', callback_data: 'input' }],
            [{ text: 'How to add real data', callback_data: 'faq' }],
        ],
    },
};

export async function handleShowMainMenu(chatId: number) {
    await bot.sendMessage(chatId, 'Check now 👇', MAIN_MENU_OPTIONS);
}

export async function handleCheckAge(chatId: number, id: number) {
    const createDate = new CreationDate();
    const data = createDate.func(id);
    const date = moment(parseInt((data * 1000).toString()))
        .utc()
        .format('YYYY-MM-DD');
    await bot.sendMessage(chatId, `Your registered date: ${date.toString()}`);

    // const days = calculateDiffDays(data * 1000);

    await handleShowMainMenu(chatId);
}

export async function handleAddData(chatId: number, id: number, registeredDate: string) {
    const joinDate = convertToEpoch(registeredDate);

    const createDate = new CreationDate();
    createDate.addDatapoint([id, joinDate]);
    await bot.sendMessage(chatId, 'added');

    await handleShowMainMenu(chatId);
}

export async function handleFaq(chatId: number) {
    await bot.sendMessage(chatId, FAQ);
    await handleShowMainMenu(chatId);
}

export async function handleGetReward(query: TelegramBot.CallbackQuery) {
    const userId = query.from.id;
    const languageCode = query.from?.language_code ?? 'en';
    const language: MessageLanguages = LANGS.includes(languageCode as MessageLanguages)
        ? (languageCode as MessageLanguages)
        : 'en';

    const createDate = new CreationDate();
    const date = createDate.func(userId);

    const rewardService = new RewardService();
    const reward = await rewardService.getReward(query, date);

    const clean = cleanMessage(query);

    for (const [key, value] of Object.entries(clean)) {
        if (key !== 'forward_from' && key !== 'from') {
            continue;
        }

        clean[key]['registered'] = moment(parseInt((date * 1000).toString()))
            .utc()
            .format('YYYY-MM-DD');
        clean[key]['age_point'] = reward.agePoint;
        clean[key]['premium_point'] = reward.premiumPoint;
        clean[key]['og_point'] = reward.ogPoint;
        clean[key]['total_point'] = reward.totalPoint;
    }

    let tree = MESSAGES[language];
    tree += treeDisplay(clean, 0);

    await bot.sendMessage(userId, tree, { parse_mode: 'HTML' });

    await handleShowMainMenu(userId);
}
