import { Request, Response } from "express";
import client from "../utils/redis";
import bcrypt from 'bcrypt';
import { updateUserPassword } from "../services/updateUserPassword.service";
import { AppDataSource } from "../data-source";
import { UserInfo } from "../entity/UserInfo.entity";
import { sanitizeInput, validatePassword } from "../services/password.services";

export const resetPasswordController = async (req: Request, res: Response) => {
    const token = req.query.token as string;

    if (!token) {
        return res.status(400).send('Token is required.');
    }

    try {
        const userEmail = await client.get(`password_reset:${token}`);
        
        if (!userEmail) {
            return res.status(400).send('Invalid or expired token.');
        }

        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).send('New password is required.');
        }

        // Hash the new password
        if (!validatePassword(newPassword)) {
            return res.status(400).send("Password does not meet complexity requirements.");
          }

        const sanitizedPassword = sanitizeInput(newPassword);  
        const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

        const userRepository = AppDataSource.getRepository(UserInfo);
        const user = await userRepository.findOneBy({ email: userEmail });

        if (!user) {
            return res.status(400).send('Invalid credentials or user not found.');
        }

        // Update the user's password
        await updateUserPassword(user.user_id, hashedPassword);
        
        // Delete the token from Redis
        await client.del(`password_reset:${token}`);

        res.send('Password has been reset successfully.');
    } catch (error) {
        console.error('Error processing password reset:', error);
        res.status(500).send('Server error.');
    }
};
