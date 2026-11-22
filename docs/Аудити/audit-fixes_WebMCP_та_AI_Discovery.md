# Виправлення за аудитом WebMCP та AI Discovery: «Кролівництво від А до Я»

**Дата:** 22 листопада 2026 року
**Підстава:** аудит WebMCP та AI Discovery від 22.11.2026 (Relvato WebMCP Checker / ARD Conformance Scanner)
**Результат:** усі три зауваження з аудиту закрито. Автотести проходять (16 з 16), типи змінених файлів без помилок.

---

## Підсумок

| № | Зауваження з аудиту | Статус | Файли |
| :-- | :--- | :--- | :--- |
| 1 | Додати `outputSchema` до WebMCP-інструментів | Виконано (розширено: додано `structuredContent`) | `src/utils/webmcp.ts`, `src/utils/webmcp.test.ts` |
| 2 | Додати `llms.txt` і `llms-full.txt` до каталогу ШІ-ресурсів | Виконано, автоматично через генератор | `scripts/sync-ai-catalog.mjs` |
| 3 | CORS-заголовки для ШІ-файлів | Виконано | `vercel.json` |

Додатково виправлено побічну проблему, якої в аудиті не було (див. розділ 2).

---

## 1. `outputSchema` для WebMCP-інструментів

**Файли:** `src/utils/webmcp.ts`, `src/utils/webmcp.test.ts`

### Що зроблено
- У тип `ToolDef` додано необов'язкове поле `outputSchema`.
- Тип `ToolResult` розширено полями `structuredContent` та `isError`.
- Обидва інструменти (`search_rabbit_articles`, `open_site_page`) отримали `outputSchema` і повертають відповідний `structuredContent`.

### Відхилення від рекомендації аудиту
Аудит пропонував описати схемою обгортку `content: [{ type: "text", text }]`. У специфікації MCP `outputSchema` зазвичай описує саме `structuredContent`, тому схеми описують його. Текстова частина `content` збережена без змін як запасний варіант для клієнтів, які `structuredContent` не підтримують.

### Структура відповідей

**`search_rabbit_articles`**

```json
{
  "results": [
    { "title": "...", "path": "/...", "section": "...", "desc": "..." }
  ],
  "message": "Нічого не знайдено."
}
```

- `results` обов'язкове. Поля `section` і `desc` з'являються, лише якщо вони є в картці.
- `message` є тільки коли результатів немає: «Порожній запит.» або «Нічого не знайдено.».

**`open_site_page`**

```json
{ "opened": true, "path": "/feeding", "message": "Відкрито: /feeding" }
```

- Обов'язкові поля: `opened` і `message`.
- Для відмов (зовнішній URL, приватний або відсутній маршрут) `opened: false` і додатково `isError: true`.

### Тести
Додано чотири нові тести:
1. Обидва інструменти мають `outputSchema` потрібної форми.
2. Пошук повертає коректний `structuredContent` для успіху, порожнього результату і порожнього запиту.
3. Відкриття сторінки повертає коректний `structuredContent` та `isError` для успіху й відмов.
4. У кожній відповіді присутні всі обов'язкові (`required`) поля зі схеми.

Усі 12 наявних тестів `webmcp` та 2 тести `webmcpCards` проходять без змін.

---

## 2. Базові ШІ-ресурси в каталозі

**Файл:** `scripts/sync-ai-catalog.mjs`

### Що зроблено
- Додано константу `BASE_RESOURCES` із записами для `/llms.txt` та `/llms-full.txt` (тип `text/plain`, описи й `representativeQueries` з аудиту).
- Генератор вставляє ці записи на **початок** масиву `entries` у `public/.well-known/ai-catalog.json` та `public/.well-known/ard.json`, якщо їх там ще немає.
- Повторний запуск нічого не змінює (перевірено). Наявні записи про сторінки (`text/html`) не чіпаються.
- Ручне редагування JSON-файлів каталогу не потрібне: вони оновляться під час `postbuild`.

### Додаткове виправлення
Без правки генератор для запису на `/llms.txt` постійно видавав би хибне попередження «веде на сторінку, якої немає в `prerender-routes.ts`». Тепер шляхи базових ресурсів із цієї перевірки виключені.

### Перевірка
Скрипт запущено на тестовій копії структури проєкту. Результат: обидва ресурси на початку каталогів, порядок записів — `llms`, `llms-full`, далі наявні, далі нові; другий запуск повідомляє «без змін».

---

## 3. CORS-заголовки для ШІ-файлів

**Файл:** `vercel.json`

### Що зроблено
Додано два правила `headers` з `Access-Control-Allow-Origin: *` та `Access-Control-Allow-Methods: GET, OPTIONS`:

- `/.well-known/(.*)`
- `/(llms\.txt|llms-full\.txt)`

### Відхилення від рекомендації аудиту
Замість одного регулярного виразу `/(\.well-known/.*|llms.*\.txt)` зроблено два прості правила. Так надійніше працює розбір маршрутів у Vercel. Складений регекс міг би збігатися і з зайвими файлами.

Наявний блок із `X-Frame-Options`, CSP та іншими заголовками не змінено. Блок `rewrites` також не змінено: `llms.txt`, `llms-full.txt`, `ard.json` та `ai-catalog.json` у ньому вже були винятками.

---

## Куди покласти файли

| Файл | Шлях у проєкті |
| :--- | :--- |
| `webmcp.ts` | `src/utils/webmcp.ts` |
| `webmcp.test.ts` | `src/utils/webmcp.test.ts` |
| `sync-ai-catalog.mjs` | `scripts/sync-ai-catalog.mjs` |
| `vercel.json` | корінь проєкту |

Файл `sync-ai-catalog_1.mjs` з вивантаження був точною копією `sync-ai-catalog.mjs`, його можна видалити.

---

## Що залишилося зробити на вашому боці

1. Покласти файли за таблицею вище.
2. Запустити `npm test`.
3. Виконати `npm run build`. Хук `postbuild` оновить каталоги, після чого закомітити зміни в `public/.well-known/ai-catalog.json` та `public/.well-known/ard.json`.
4. Після деплою перевірити CORS:
   ```bash
   curl -I https://rabbit-farming-from-a-to-z-react.vercel.app/llms.txt
   curl -I https://rabbit-farming-from-a-to-z-react.vercel.app/llms-full.txt
   curl -I https://rabbit-farming-from-a-to-z-react.vercel.app/.well-known/ai-catalog.json
   ```
   У відповіді має бути `access-control-allow-origin: *`.
5. Повторно запустити Relvato WebMCP Checker / ARD Conformance Scanner.

---

## Обмеження перевірки

- Тести та скрипт запускалися на копії структури проєкту, а не на реальному сайті. Реальні файли каталогів і `src/prerender-routes.ts` я не бачив.
- `src/utils/webmcpCards.ts` перевірено лише тестами; перевірку типів для нього не проведено, бо модуль `../data/sectionCards` належить проєкту.
- Підтримка `outputSchema` і `structuredContent` залежить від версії браузерного WebMCP. Клієнти, які їх не знають, ігнорують ці поля й користуються текстовою частиною `content`.
