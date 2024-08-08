import { REWARD_OG_POINT } from './../constants/reward.constant';
import TelegramBot from 'node-telegram-bot-api';
import { calculateDiffDays } from '../utils/utils';
import { RewardResponseDto } from '../interfaces/reward.interface';
import {
    REWARD_AGE_POINT,
    REWARD_OG_CONDITION_DATE,
    REWARD_PREMIUM_POINT,
    REWARD_TELEGRAM_START_DATE,
} from '../constants/reward.constant';

export default class RewardService {
    async getReward(query: TelegramBot.CallbackQuery, date: number): Promise<RewardResponseDto> {
        const isPremium: boolean = (query.from as any).is_premium || false;
        const isBot: boolean = (query.from as any).is_bot || false;

        const agePoint = this._calcualteAgeReward(date);
        this._calculateActivityReward(isBot);
        const premiumPoint = this._calculatePremiumReward(isPremium);
        const ogPoint = this._calculateOGReward(date);

        const totalPoint = agePoint + premiumPoint + ogPoint;

        return {
            agePoint,
            premiumPoint,
            ogPoint,
            totalPoint,
        };
    }

    private _calcualteAgeReward(date: number): number {
        const today = new Date();
        const createdDate = new Date(date * 1000);

        const diffDays = calculateDiffDays(createdDate, today);

        const teleStartDate = new Date(REWARD_TELEGRAM_START_DATE);
        const startDiffDays = calculateDiffDays(teleStartDate, today);

        const points = diffDays * (REWARD_AGE_POINT / startDiffDays);

        return Math.floor(points);
    }

    private _calculateActivityReward(isBot: boolean): boolean {
        return isBot;
    }

    private _calculatePremiumReward(isPremium: boolean): number {
        return isPremium ? REWARD_PREMIUM_POINT : 0;
    }

    private _calculateOGReward(date: number): number {
        const today = new Date();
        const createdDate = new Date(date * 1000);

        const diffDays = calculateDiffDays(createdDate, today);

        return diffDays > REWARD_OG_CONDITION_DATE ? REWARD_OG_POINT : 0;
    }
}
