// scripts/test-send-email.mjs
//
// Використання:
//   node scripts/test-send-email.mjs <шлях-до-html> "<тема>" <email-одержувача>
//
// Приклад:
//   node scripts/test-send-email.mjs lyst-pidpyska_aktyvovana.html "Тест верстки" rabbit.farming.ua@gmail.com
//
// Секрет і URL береться з env, щоб не хардкодити в коді:
//   SEND_EMAIL_SECRET=... SEND_EMAIL_URL=https://rabbit-farming-from-a-to-z-react.vercel.app/api/send-email node scripts/test-send-email.mjs ...

import { readFileSync } from 'node:fs';

const [, , filePath, subject, to] = process.argv;

if (!filePath || !subject || !to) {
    console.error('Використання: node scripts/test-send-email.mjs <html-файл> "<тема>" <email>');
    process.exit(1);
}

const secret = process.env.SEND_EMAIL_SECRET;
const url = process.env.SEND_EMAIL_URL ?? 'https://rabbit-farming-from-a-to-z-react.vercel.app/api/send-email';

if (!secret) {
    console.error('Задайте SEND_EMAIL_SECRET у середовищі перед запуском.');
    process.exit(1);
}

const html = readFileSync(filePath, 'utf-8');

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-send-secret': secret,
    },
    body: JSON.stringify({ to, subject, html }),
});

const result = await response.json();
console.log(response.status, result);
