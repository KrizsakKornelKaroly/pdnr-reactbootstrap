// src/services/duty.service.ts
import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";
import { Duty } from "../entity/Duty.entity";
import { DutyLog } from "../entity/DutyLog.entity";
import redis from "../utils/redisClient";

const DUTY_KEY_PREFIX = 'duty:active:';
const AFK_TIMEOUT =  4 * 60 * 60 * 1000;
const dutyRepository = AppDataSource.getRepository(Duty);
const dutyLogRepository = AppDataSource.getRepository(DutyLog);
const userRepository = AppDataSource.getRepository(UserInfo);

const scheduleAfkCheck = async (userId: number, startTime: number) => {
    const timeoutId = setTimeout(async () => {
        try {
            const key = DUTY_KEY_PREFIX + userId;
            const currentStartTimeStr = await redis.get(key);
            
            if (currentStartTimeStr && parseInt(currentStartTimeStr) === startTime) {
                console.log(`AFK timeout reached for user ${userId}, stopping duty`);
                await stopDuty(userId);
            }
        } catch (error) {
            console.error('Error in AFK check:', error);
        }
    }, AFK_TIMEOUT);

    return timeoutId;
};

export const startDuty = async (userId: number): Promise<{
    success: boolean;
    duty?: Duty;
    message?: string;
    startTime?: number;
}> => {
    try {
        const key = DUTY_KEY_PREFIX + userId;
        
        const existingDuty = await redis.get(key);
        if (existingDuty) {
            return { success: false, message: "User already on duty" };
        }

        const user = await userRepository.findOne({ where: { user_id: userId } });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const startTime = Date.now(); // Server-side timestamp
        await redis.set(key, startTime.toString());
        
        scheduleAfkCheck(userId, startTime);
        
        let duty = await dutyRepository.findOne({
            where: { userInfo: { user_id: userId } },
            relations: ['userInfo']
        });

        if (!duty) {
            duty = new Duty();
            duty.userInfo = user;
        }

        duty.isActive = true;
        duty.lastDutyOn = new Date(startTime);
        duty.lastDutyOff = null;
        
        const savedDuty = await dutyRepository.save(duty);
        return { 
            success: true, 
            duty: savedDuty,
            startTime // Return startTime to client
        };

    } catch (error) {
        console.error('Error starting duty:', error);
        return { success: false, message: "Internal server error" };
    }
};

export const stopDuty = async (userId: number): Promise<{
    success: boolean;
    totalDutyTime?: number;
    lastDutyDuration?: number;
    message?: string;
}> => {
    try {
        const key = DUTY_KEY_PREFIX + userId;
        
        const startTimeStr = await redis.get(key);
        if (!startTimeStr) {
            return { success: false, message: "No active duty found" };
        }

        const startTime = parseInt(startTimeStr);
        const endTime = Date.now(); // Server-side timestamp
        const durationMs = endTime - startTime;
        const durationSeconds = Math.floor(durationMs / 1000);

        await redis.del(key);

        const duty = await dutyRepository.findOne({
            where: { userInfo: { user_id: userId }, isActive: true },
            relations: ['userInfo']
        });

        if (duty) {
            duty.isActive = false;
            duty.lastDutyOff = new Date(endTime);
            duty.lastDutyDuration = durationSeconds;
            duty.totalDutyTime += durationSeconds;
            await dutyRepository.save(duty);

            const dutyLog = new DutyLog();
            dutyLog.duty = duty;
            dutyLog.userInfo = duty.userInfo;
            dutyLog.dutyOn = new Date(startTime);
            dutyLog.dutyOff = new Date(endTime);
            dutyLog.durationInSeconds = durationSeconds;
            await dutyLogRepository.save(dutyLog);

            return {
                success: true,
                totalDutyTime: duty.totalDutyTime,
                lastDutyDuration: durationSeconds
            };
        }

        return { success: false, message: "No active duty record found" };

    } catch (error) {
        console.error('Error stopping duty:', error);
        return { success: false, message: "Internal server error" };
    }
};

export const isOnDuty = async (userId: number): Promise<boolean> => {
    const key = DUTY_KEY_PREFIX + userId;
    const exists = await redis.exists(key);
    return exists === 1;
};

export const getCurrentDuration = async (userId: number): Promise<number | null> => {
    const key = DUTY_KEY_PREFIX + userId;
    const startTimeStr = await redis.get(key);
    
    if (!startTimeStr) {
        return null;
    }

    const startTime = parseInt(startTimeStr);
    const currentServerTime = Date.now(); // Using server time for accuracy
    return currentServerTime - startTime;
};


export const loadTimersFromRedis = async (): Promise<void> => {
    try {
        // Get all keys matching the duty prefix pattern
        const keys = await redis.keys(`${DUTY_KEY_PREFIX}*`);
        
        // For each active duty in Redis
        for (const key of keys) {
            const userId = parseInt(key.replace(DUTY_KEY_PREFIX, ''));
            const startTimeStr = await redis.get(key);
            
            if (!startTimeStr) {
                continue;
            }

            // Verify duty record exists in database
            const duty = await dutyRepository.findOne({
                where: { userInfo: { user_id: userId } },
                relations: ['userInfo']
            });

            if (!duty) {
                // If no matching database record, remove the Redis key
                console.log(`No duty record found for user ${userId}, cleaning up Redis`);
                await redis.del(key);
                continue;
            }

            // Ensure database record is marked as active
            if (!duty.isActive) {
                duty.isActive = true;
                duty.lastDutyOn = new Date(parseInt(startTimeStr));
                await dutyRepository.save(duty);
            }

            console.log(`Loaded active duty for user ${userId}`);
        }

        console.log('Duty timers initialized successfully');
    } catch (error) {
        console.error('Error loading duty timers:', error);
        throw error;
    }
};