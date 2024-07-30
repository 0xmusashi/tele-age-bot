import { bot } from './bot';
import {
    handleShowMainMenu,
    handleCheckAge,
    handleAddData,
    handleFaq
} from './command-handlers';

bot.onText(/\/start/, async (msg, match) => {
    try {
        await handleShowMainMenu(msg);
    } catch (err) {
    }
});

bot.onText(/\/id (.+)/, async (msg, match) => {
    const id = parseInt(match ? match[1] : '0');
    try {
        await handleCheckAge(msg, id);
    } catch (err) {
    }
});

bot.onText(/\/add (.+) (.+)/, async (msg, match) => {
    const id = parseInt(match ? match[1] : '0');
    const registeredDate = match ? match[2] : '0';

    try {
        await handleAddData(msg, id, registeredDate);
    } catch (err) {
    }
});

bot.on('callback_query', async (query) => {
    const chatId = query.message!.chat.id;
    const data = query.data;

    if (data == 'check') {
        await handleCheckAge(query.message!, chatId);
    } else if (data == 'input') {
        await bot.sendMessage(chatId, 'Please enter user telegram id & registered date (e.g. "1559803968 2022-12-01")')
        bot.once('message', async function handleInput(msg) {
            const inputs = msg.text!.split(' ');
            const id = Number(inputs[0]);
            const registeredDate = inputs[1];
            if (inputs.length === 2 && !isNaN(Number(inputs[0]))) {
                await handleAddData(query.message!, id, registeredDate);
            } else {
                await bot.sendMessage(chatId, 'Invalid input. Please try again with two valid numbers.');
            }
        });
    } else if (data == 'faq') {
        await handleFaq(query.message!);
    }
});