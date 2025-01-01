import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Correct service setting
  port: 587, // Port for STARTTLS
  secure: false, // Use false for port 587
  logger: true, // Enable logging
  debug: true,  // Enable debug output
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Function to send a password reset email
export const sendResetEmail = async (userEmail: string, resetToken: string): Promise<void> => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: 'Password Reset Request',
    text: `Please click the following link to reset your password: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
    console.log(mailOptions)
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
