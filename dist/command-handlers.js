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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleShowMainMenu = handleShowMainMenu;
exports.handleCheckAge = handleCheckAge;
exports.handleAddData = handleAddData;
exports.handleFaq = handleFaq;
const bot_1 = require("./bot");
const CreationDate_1 = __importDefault(require("./CreationDate"));
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const MAIN_MENU_OPTIONS = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'Check Account Age', callback_data: 'check' }],
            [{ text: 'Input real data', callback_data: 'input' }],
            [{ text: 'How to add real data', callback_data: 'faq' }],
        ]
    }
};
function handleShowMainMenu(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        yield bot_1.bot.sendMessage(chatId, 'Check now 👇', MAIN_MENU_OPTIONS);
    });
}
function handleCheckAge(msg, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const createDate = new CreationDate_1.default();
        const data = createDate.func(id);
        const date = (0, moment_1.default)(parseInt((data * 1000).toString())).utc().format("YYYY-MM-DD");
        yield bot_1.bot.sendMessage(chatId, `Your registered date: ${date.toString()}`);
        const days = (0, utils_1.calculateDays)(data * 1000);
        yield handleShowMainMenu(msg);
    });
}
function handleAddData(msg, id, registeredDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        const joinDate = (0, utils_1.convertToEpoch)(registeredDate);
        const createDate = new CreationDate_1.default();
        createDate.addDatapoint([id, joinDate]);
        yield bot_1.bot.sendMessage(chatId, 'added');
        yield handleShowMainMenu(msg);
    });
}
function handleFaq(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        yield bot_1.bot.sendMessage(chatId, constants_1.FAQ);
        yield handleShowMainMenu(msg);
    });
}
