import { Request, Response } from "express";
import { sendResetEmail } from "../utils/emailService";
import { storeResetToken } from "../utils/redisService";

export const requestPasswordResetController = async (req: Request, res: Response) => {
  const { userEmail } = req.body;

  try {
    const resetToken = await storeResetToken(userEmail);
    await sendResetEmail(userEmail, resetToken);

    res.status(200).send('Password reset email sent');
  } catch (error) {
    console.error('Error handling password reset request:', error);
    res.status(500).send('Internal Server Error');
  }
};