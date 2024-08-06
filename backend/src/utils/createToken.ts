import { randomBytes } from 'crypto';

export const generateResetToken = (): string => {
    return randomBytes(32).toString('hex');
}