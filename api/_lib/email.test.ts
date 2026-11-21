// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mocks = vi.hoisted(() => ({
    createTransport: vi.fn(),
    sendMail: vi.fn(),
}));

vi.mock('nodemailer', () => ({
    default: { createTransport: mocks.createTransport },
}));

// Модуль читає змінні оточення під час імпорту, тому кожен тест імпортує його заново.
async function loadModule() {
    vi.resetModules();
    return import('./email');
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('GMAIL_USER', 'farm@gmail.com');
    vi.stubEnv('GMAIL_APP_PASSWORD', 'app-password');
    mocks.createTransport.mockReturnValue({ sendMail: mocks.sendMail });
    mocks.sendMail.mockResolvedValue({ messageId: 'msg-1' });
});

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('налаштування транспорту', () => {
    it('створює транспорт Gmail з логіном і паролем додатка зі змінних оточення', async () => {
        await loadModule();
        expect(mocks.createTransport).toHaveBeenCalledTimes(1);
        expect(mocks.createTransport).toHaveBeenCalledWith({
            service: 'gmail',
            auth: { user: 'farm@gmail.com', pass: 'app-password' },
        });
    });

    it('формує адресу відправника з назвою сервісу і поштою з GMAIL_USER', async () => {
        const { FROM_ADDRESS } = await loadModule();
        expect(FROM_ADDRESS).toBe('"Кролівництво від А до Я" <farm@gmail.com>');
    });

    it('експортує створений транспорт', async () => {
        const { transporter } = await loadModule();
        expect(transporter.sendMail).toBe(mocks.sendMail);
    });
});

describe('sendEmail', () => {
    it('надсилає лист через транспорт із правильними полями і повертає true', async () => {
        const { sendEmail } = await loadModule();
        const ok = await sendEmail('user@example.com', 'Тема', '<p>Привіт</p>');
        expect(ok).toBe(true);
        expect(mocks.sendMail).toHaveBeenCalledWith({
            from: '"Кролівництво від А до Я" <farm@gmail.com>',
            to: 'user@example.com',
            subject: 'Тема',
            html: '<p>Привіт</p>',
        });
    });

    it('при помилці транспорту повертає false, пише в лог і не кидає виняток', async () => {
        mocks.sendMail.mockRejectedValue(new Error('smtp down'));
        const { sendEmail } = await loadModule();
        await expect(sendEmail('user@example.com', 'Тема', '<p>x</p>')).resolves.toBe(false);
        expect(console.error).toHaveBeenCalled();
    });

    it('збій одного листа не заважає наступному', async () => {
        mocks.sendMail.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce({ messageId: 'ok' });
        const { sendEmail } = await loadModule();
        expect(await sendEmail('a@example.com', 'T', 'H')).toBe(false);
        expect(await sendEmail('b@example.com', 'T', 'H')).toBe(true);
    });
});
