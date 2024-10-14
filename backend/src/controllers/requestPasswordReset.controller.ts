import { Request, Response } from "express";
import { sendResetEmail } from "../utils/emailService";
import { storeResetToken } from "../utils/redisService";

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const requestPasswordResetController = async (req: Request, res: Response) => {
  const { userEmail } = req.body;
  
  if (!userEmail || !isValidEmail(userEmail)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    const resetToken = await storeResetToken(userEmail);
    await sendResetEmail(userEmail, resetToken);

    res.status(200).json({ message: 'Jelszóemlékeztető email elküldve' });
  } catch (error) {
    console.error('Error handling password reset request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
