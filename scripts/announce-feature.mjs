// scripts/announce-feature.mjs
//
// Використання:
//   SEND_EMAIL_SECRET=ваш_секрет node scripts/announce-feature.mjs "опис нової функції"
//
// Приклад:
//   SEND_EMAIL_SECRET=xxx node scripts/announce-feature.mjs "додано експорт реєстру в Excel"

const description = process.argv[2];

if (!description) {
    console.error('Використання: node scripts/announce-feature.mjs "опис нової функції"');
    process.exit(1);
}

const secret = process.env.SEND_EMAIL_SECRET;
const url = process.env.ANNOUNCE_URL ?? 'https://rabbit-farming-from-a-to-z-react.vercel.app/api/send-feature-announcement';

if (!secret) {
    console.error('Задайте SEND_EMAIL_SECRET у середовищі перед запуском.');
    process.exit(1);
}

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-send-secret': secret,
    },
    body: JSON.stringify({ description }),
});

const result = await response.json();
console.log(response.status, result);
