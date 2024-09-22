// src/services/duty.service.ts
import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";
import { Duty } from "../entity/Duty.entity";
import { DutyLog } from "../entity/DutyLog.entity";
import redis from "../utils/redis";

// In-memory duty timers
const dutyTimers: { [key: number]: NodeJS.Timeout } = {};

// Helper function to start a duty timer and log the start
export const startDutyTimer = async (userId: number, durationMs: number): Promise<void> => {
    const timerKey = `dutyTimer:${userId}`;

    try {
        // Store the current time in Redis to track the start of the timer
        await redis.set(timerKey, Date.now().toString());

        // Log the start of the duty
        await logDutyStart(userId);

        // Set a timer to automatically end the duty after the specified duration
        const timer = setTimeout(async () => {
            await endDutyAutomatically(userId);
        }, durationMs);

        // Store the timer in memory to allow manual clearing if needed
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

        if (duty) {
            duty.isActive = false;
            duty.lastDutyOff = new Date();
            const duration = (duty.lastDutyOff.getTime() - duty.lastDutyOn.getTime()) / 1000; // Duration in seconds
            duty.lastDutyDuration = Math.floor(duration);
            duty.totalDutyTime += duty.lastDutyDuration;
            await dutyRepository.save(duty);

            // Log the duty stop
            await logDutyStop(duty);
        }

        // Remove the timer from Redis and in-memory
        await redis.del(timerKey);
        console.log(`Duty for user ${userId} auto-ended after timeout.`);
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
            const startTime = parseInt((await redis.get(key)) || "0", 10);
            const elapsedTime = Date.now() - startTime;
            const AUTO_END_DURATION_MS = 60 * 1000; // 1 minute; adjust to 4 hours in production

            // Check if the timer has expired
            if (elapsedTime < AUTO_END_DURATION_MS) {
                // Resume the timer with the remaining time
                await startDutyTimer(userId, AUTO_END_DURATION_MS - elapsedTime);
            } else {
                // If time has already expired, auto-end the duty
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

        if (duty) {
            duty.isActive = false;
            duty.lastDutyOff = new Date();
            const duration = (duty.lastDutyOff.getTime() - duty.lastDutyOn.getTime()) / 1000; // Duration in seconds
            duty.lastDutyDuration = Math.floor(duration);
            duty.totalDutyTime += duty.lastDutyDuration;
            await dutyRepository.save(duty);

            // Log the duty stop
            await logDutyStop(duty);

            // Clear the in-memory timer and delete the Redis entry
            if (dutyTimers[userId]) {
                clearTimeout(dutyTimers[userId]);
                delete dutyTimers[userId];
            }
            await redis.del(timerKey);
            console.log(`Duty for user ${userId} manually stopped.`);
        }
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
        const userInfo = await userInfoRepository.findOne({ where: { user_id: userId } });
        const duty = await dutyRepository.findOne({
            where: { userInfo: { user_id: userId }, isActive: true },
        });

        if (userInfo && duty) {
            const dutyLog = new DutyLog();
            dutyLog.dutyOn = new Date();
            dutyLog.duty = duty;
            dutyLog.userInfo = userInfo;
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
            where: { duty: { duty_id: duty.duty_id }, dutyOff: null },
            order: { dutyOn: "DESC" },
        });

        if (dutyLog) {
            dutyLog.dutyOff = new Date();
            dutyLog.durationInSeconds = Math.floor(
                (dutyLog.dutyOff.getTime() - dutyLog.dutyOn.getTime()) / 1000
            );
            await dutyLogRepository.save(dutyLog);
            console.log(`Duty log stopped for user ${duty.userInfo.user_id}.`);
        }
    } catch (error) {
        console.error(`Failed to log duty stop for user ${duty.userInfo.user_id}:`, error);
    }
};
