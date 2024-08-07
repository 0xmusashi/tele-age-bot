import { bot } from './bot';
import {
    handleShowMainMenu,
    handleCheckAge,
    handleAddData,
    handleFaq,
    handleGetReward,
} from './services/command-handlers';

bot.onText(/\/start/, async (msg, match) => {
    try {
        await handleShowMainMenu(msg.chat.id);
    } catch (err) {}
});

bot.onText(/\/id (.+)/, async (msg, match) => {
    const id = parseInt(match ? match[1] : '0');
    try {
        await handleCheckAge(msg.chat.id, id);
    } catch (err) {}
});

bot.onText(/\/add (.+) (.+)/, async (msg, match) => {
    const id = parseInt(match ? match[1] : '0');
    const registeredDate = match ? match[2] : '0';

    try {
        await handleAddData(msg.chat.id, id, registeredDate);
    } catch (err) {}
});

bot.on('callback_query', async (query) => {
    const chatId = query.message!.chat.id;
    const data = query.data;

    switch (data) {
        case 'check':
            await handleCheckAge(chatId, chatId);
            break;

        case 'input':
            await bot.sendMessage(
                chatId,
                'Please enter user telegram id & registered date (e.g. "1559803968 2022-12-01")',
            );

            bot.once('message', async function handleInput(msg) {
                const inputs = msg.text!.split(' ');

                if (inputs.length === 2 && !isNaN(Number(inputs[0]))) {
                    const id = Number(inputs[0]);
                    const registeredDate = inputs[1];

                    await handleAddData(chatId, id, registeredDate);
                } else {
                    await bot.sendMessage(chatId, 'Invalid input. Please try again with a valid ID and date.');
                }
            });
            break;

        case 'faq':
            await handleFaq(chatId);
            break;

        case 'reward':
            await handleGetReward(query);
            break;

        default:
            console.warn(`Unknown callback query data: ${data}`);
            break;
    }
});
