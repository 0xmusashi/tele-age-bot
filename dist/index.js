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
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const command_handlers_1 = require("./command-handlers");
bot_1.bot.onText(/\/start/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, command_handlers_1.handleShowMainMenu)(msg);
    }
    catch (err) {
    }
}));
bot_1.bot.onText(/\/id (.+)/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(match ? match[1] : '0');
    try {
        yield (0, command_handlers_1.handleCheckAge)(msg, id);
    }
    catch (err) {
    }
}));
bot_1.bot.onText(/\/add (.+) (.+)/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(match ? match[1] : '0');
    const registeredDate = match ? match[2] : '0';
    try {
        yield (0, command_handlers_1.handleAddData)(msg, id, registeredDate);
    }
    catch (err) {
    }
}));
bot_1.bot.on('callback_query', (query) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = query.message.chat.id;
    const data = query.data;
    if (data == 'check') {
        yield (0, command_handlers_1.handleCheckAge)(query.message, chatId);
    }
    else if (data == 'input') {
        yield bot_1.bot.sendMessage(chatId, 'Please enter user telegram id & registered date (e.g. "1559803968 2022-12-01")');
        bot_1.bot.once('message', function handleInput(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                const inputs = msg.text.split(' ');
                const id = Number(inputs[0]);
                const registeredDate = inputs[1];
                if (inputs.length === 2 && !isNaN(Number(inputs[0]))) {
                    yield (0, command_handlers_1.handleAddData)(query.message, id, registeredDate);
                }
                else {
                    yield bot_1.bot.sendMessage(chatId, 'Invalid input. Please try again with two valid numbers.');
                }
            });
        });
    }
}));
