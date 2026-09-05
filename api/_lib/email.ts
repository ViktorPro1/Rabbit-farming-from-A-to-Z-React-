import nodemailer from 'nodemailer';

export const FROM_ADDRESS = `"Кролівництво від А до Я" <${process.env.GMAIL_USER}>`;

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Той самий підхід, що й sendToUser у push.ts: помилка одного листа
// не повинна валити всю денну розсилку — логуємо і йдемо далі.
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
        await transporter.sendMail({ from: FROM_ADDRESS, to, subject, html });
        return true;
    } catch (err) {
        console.error('[send-email]', err);
        return false;
    }
}