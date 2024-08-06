import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your preferred email service
    auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password'
    }
});