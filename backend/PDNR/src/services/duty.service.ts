// src/services/duty.service.ts
import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";
import { Duty } from "../entity/Duty.entity";
import { DutyLog } from "../entity/DutyLog.entity";
import redis from "../utils/redisClient";
import { IsNull, Repository } from "typeorm";

// Constants
const AUTO_END_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours

// In-memory duty timers
const dutyTimers: Record<number, NodeJS.Timeout> = {};

// Helper function to start a duty timer
export const startDutyTimer = async (
    userId: number,
    durationMs: number
): Promise<void> => {
    const timerKey = `dutyTimer:${userId}`;

    try {
        await redis.set(timerKey, Date.now().toString());
        await logDutyStart(userId);

        const timer = setTimeout(async () => {
            await endDutyAutomatically(userId);
        }, durationMs);

        dutyTimers[userId] = timer;
    } catch (error) {
        console.error(`Failed to start duty timer for user ${userId}:`, error);
    }
};

// Function to end the duty automatically when the timer expires
const endDutyAutomatically = async (userId: number): Promise<void> => {
    const dutyRepository = AppDataSource.getRepository(Duty);
    const timerKey = `dutyTimer:${userId}`;

    try {
        const duty = await dutyRepository.findOne({
            where: { userInfo: { user_id: userId }, isActive: true },
            relations: ["userInfo"],
        });

        if (duty?.lastDutyOn) {
            const now = new Date();
            const duration = (now.getTime() - duty.lastDutyOn.getTime()) / 1000;

            Object.assign(duty, {
                isActive: false,
                lastDutyOff: now,
                lastDutyDuration: Math.floor(duration),
                totalDutyTime: (duty.totalDutyTime ?? 0) + Math.floor(duration),
            });

            await dutyRepository.save(duty);
            await logDutyStop(duty);
            await redis.del(timerKey);
            console.log(`Duty for user ${userId} auto-ended after timeout.`);
        } else {
            console.warn(`No active duty found for user ${userId}.`);
        }
    } catch (error) {
        console.error(`Failed to auto-end duty for user ${userId}:`, error);
    }
};

// Load timers from Redis on server startup
export const loadTimersFromRedis = async (): Promise<void> => {
    try {
        const keys = await redis.keys("dutyTimer:*");

        for (const key of keys) {
            const userId = parseInt(key.split(":")[1], 10);
            const startTime = parseInt((await redis.get(key)) ?? "0", 10);
            const elapsedTime = Date.now() - startTime;

            if (elapsedTime < AUTO_END_DURATION_MS) {
                await startDutyTimer(userId, AUTO_END_DURATION_MS - elapsedTime);
            } else {
                await stopDuty(userId);
            }
        }
    } catch (error) {
        console.error("Error loading timers from Redis:", error);
    }
};

// Stop the duty manually
export const stopDuty = async (userId: number): Promise<void> => {
    const dutyRepository = AppDataSource.getRepository(Duty);
    const timerKey = `dutyTimer:${userId}`;

    try {
        const duty = await dutyRepository.findOne({
            where: { userInfo: { user_id: userId }, isActive: true },
            relations: ["userInfo"],
        });

        if (!duty?.lastDutyOn) {
            console.warn(`Invalid or inactive duty for user ${userId}`);
            return;
        }

        const now = new Date();
        const duration = (now.getTime() - duty.lastDutyOn.getTime()) / 1000;

        Object.assign(duty, {
            isActive: false,
            lastDutyOff: now,
            lastDutyDuration: Math.floor(duration),
            totalDutyTime: (duty.totalDutyTime ?? 0) + Math.floor(duration),
        });

        await dutyRepository.save(duty);
        await logDutyStop(duty);

        if (dutyTimers[userId]) {
            clearTimeout(dutyTimers[userId]);
            delete dutyTimers[userId];
        }
        await redis.del(timerKey);
        console.log(`Duty for user ${userId} manually stopped.`);
    } catch (error) {
        console.error(`Failed to stop duty for user ${userId}:`, error);
    }
};

// Function to log the start of a duty
const logDutyStart = async (userId: number): Promise<void> => {
    const dutyRepository = AppDataSource.getRepository(Duty);
    const dutyLogRepository = AppDataSource.getRepository(DutyLog);
    const userInfoRepository = AppDataSource.getRepository(UserInfo);

    try {
        const userInfo = await userInfoRepository.findOneBy({ user_id: userId });
        const duty = await dutyRepository.findOne({
            where: { userInfo: { user_id: userId }, isActive: true },
        });

        if (userInfo && duty) {
            const dutyLog = new DutyLog();
            dutyLog.userInfo = userInfo;
            dutyLog.duty = duty;
            await dutyLogRepository.save(dutyLog);
            console.log(`Duty log started for user ${userId}.`);
        }
    } catch (error) {
        console.error(`Failed to log duty start for user ${userId}:`, error);
    }
};

// Function to log the stop of a duty
const logDutyStop = async (duty: Duty): Promise<void> => {
    const dutyLogRepository = AppDataSource.getRepository(DutyLog);

    try {
        const dutyLog = await dutyLogRepository.findOne({
            where: { duty: { duty_id: duty.duty_id }, dutyOff: IsNull() },
            order: { dutyOn: "DESC" },
        });

        if (dutyLog) {
            dutyLog.dutyOff = new Date();
            dutyLog.durationInSeconds = Math.floor(
                (dutyLog.dutyOff.getTime() - dutyLog.dutyOn.getTime()) / 1000
            );
            await dutyLogRepository.save(dutyLog);
            console.log(`Duty log stopped for duty ${duty.duty_id}.`);
        }
    } catch (error) {
        console.error(`Failed to log duty stop for duty ${duty.duty_id}:`, error);
    }
};
