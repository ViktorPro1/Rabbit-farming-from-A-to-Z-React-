import nodemailer from 'nodemailer';

export const FROM_ADDRESS = `"Кролівництво від А до Я" <${process.env.GMAIL_USER}>`;

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});
