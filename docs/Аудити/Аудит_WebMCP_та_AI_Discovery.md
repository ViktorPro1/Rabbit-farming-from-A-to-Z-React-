# Аудит WebMCP та AI Discovery: «Кролівництво від А до Я»

**Дата аудиту:** 22 листопада 2026 року  
**Статус сайту:** Робочий, критичних проблем не виявлено. Готовий до використання браузерними ШІ-агентами.  
**Інструмент перевірки:** Relvato WebMCP Checker / ARD Conformance Scanner.

---

## 1. Загальний огляд та поточний стан

Сайт демонструє високий рівень інтеграції із сучасними стандартами Machine Learning & AI Discovery:
* **WebMCP (Web Model Context Protocol):** Зареєстровано 2 клієнтські інструменти:
  - `search_rabbit_articles` — повнотекстовий пошук за статтями сайту;
  - `open_site_page` — клієнтська SPA-навігація до відкритих сторінок сайту.
* **AI Discovery (ARD / AI Catalog):**
  - Валідний маніфест `/.well-known/ai-catalog.json` та його дзеркало `/.well-known/ard.json`.
  - Присутній `did:web`-ідентифікатор хоста та структуровані `representativeQueries` для семантичного векторного пошуку.
* **LLM-індексація:**
  - Присутні файли `/llms.txt` та `/llms-full.txt` з актуальною структурою сайту та контентом.

---

## 2. Аналіз зауважень та рекомендації

### Зауваження 1. Додати `outputSchema` до WebMCP-інструментів

#### Контекст та причина
Браузерні ШІ-моделі (Chrome Model Context API / W3C WebML) спираються на `inputSchema` для валідації вхідних параметрів та на `outputSchema` для прогнозування структури результату. Зараз інструменти повертають MCP-сумісний об'єкт `{ content: [{ type: "text", text: string }] }`, але в маніфесті інструменту це поле відсутнє.

#### Де внести зміни
- **Файл:** `src/utils/webmcp.ts`
- **Тести:** `src/utils/webmcp.test.ts`

#### Рішення
1. Розширити тип `ToolDef` необов'язковим полем `outputSchema`:
```typescript
interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>; // Нове поле
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
}
```

2. Додати схему до інструменту `search_rabbit_articles`:
```typescript
outputSchema: {
  type: "object",
  properties: {
    content: {
      type: "array",
      description: "Результат пошуку у форматі MCP",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["text"] },
          text: {
            type: "string",
            description: "Список знайдених статей із назвами, розділами й посиланнями або повідомлення про відсутність результатів",
          },
        },
        required: ["type", "text"],
      },
    },
  },
  required: ["content"],
}
```

3. Додати схему до інструменту `open_site_page`:
```typescript
outputSchema: {
  type: "object",
  properties: {
    content: {
      type: "array",
      description: "Результат навігації у форматі MCP",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["text"] },
          text: {
            type: "string",
            description: "Підтвердження успішного переходу або повідомлення про помилку шляху",
          },
        },
        required: ["type", "text"],
      },
    },
  },
  required: ["content"],
}
```

---

### Зауваження 2. Переглянути типи ресурсів у `ai-catalog.json` (`text/html`)

#### Контекст та причина
Специфікація **Agentic Resource Discovery (ARD)** та каталоги `ai-catalog.json` призначені для публікації **машиночитних ресурсів для ШІ**:
- `application/mcp-server-card+json` (сервери MCP)
- `application/agent-card+json` / `application/agent-skills+json` (ШІ-агенти та навички)
- `application/openapi+json` (API)
- `text/markdown` або `text/plain` (документація та агреговані дані, як `llms.txt`)

Коли сканер бачить у каталозі 140+ записів виключно з `"type": "text/html"`, він фіксує, що каталог дублює sitemap веб-сторінок для людей замість пропонування специфічних ШІ-ресурсів.

#### Рішення
1. **Зберегти сторінки:** Не видаляти наявні записи з типом `text/html`. Стандарт допускає будь-які валідні MIME-типи, тому для статей це коректне маркування.
2. **Додати первинні ШІ-ресурси на початок каталогу:**
   Додати у `public/.well-known/ai-catalog.json` та `public/.well-known/ard.json` спеціалізовані ресурси:
   ```json
   {
     "identifier": "urn:air:rabbit-farming-from-a-to-z-react.vercel.app:resource:llms",
     "displayName": "LLMs Довідник (llms.txt)",
     "type": "text/plain",
     "url": "https://rabbit-farming-from-a-to-z-react.vercel.app/llms.txt",
     "description": "Компактний індекс структури сайту, тем і навігаційних посилань для мовних моделей",
     "representativeQueries": [
       "довідник кролівництва для штучного інтелекту",
       "llms txt кролівництво",
       "структура сайту кролівництво"
     ]
   },
   {
     "identifier": "urn:air:rabbit-farming-from-a-to-z-react.vercel.app:resource:llms-full",
     "displayName": "Повний LLMs Довідник (llms-full.txt)",
     "type": "text/plain",
     "url": "https://rabbit-farming-from-a-to-z-react.vercel.app/llms-full.txt",
     "description": "Повний текстовий масив усіх статей та матеріалів сайту для аналізу мовними моделями",
     "representativeQueries": [
       "повна база знань про кролівництво",
       "всі статті про кролів одним файлом",
       "повний текст посібника з кролівництва"
     ]
   }
   ```
3. **Оновити генератор:**
   У `scripts/sync-ai-catalog.mjs` забезпечити, щоб при автогенерації нових маршрутів ці базові ресурси не затиралися.

---

### 3. Додаткове покращення: CORS заголовки для ШІ-агентів

#### Контекст та причина
Браузерні ШІ-агенти часто виконують `fetch`-запити з довільних контекстів або розширень. Щоб уникнути помилок блокування CORS для каталогів та LLM-файлів, рекомендується явно вказати заголовки.

#### Де внести зміни
- **Файл:** `vercel.json`

#### Рішення
Додати блок заголовків для публічних ШІ-файлів:
```json
{
  "source": "/(\\.well-known/.*|llms.*\\.txt)",
  "headers": [
    { "key": "Access-Control-Allow-Origin", "value": "*" },
    { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" }
  ]
}
```

---

## 4. Підсумок та план дій

| Пріоритет | Завдання | Файли | Ризик для роботи сайту |
| :--- | :--- | :--- | :--- |
| **Низький (плановий)** | Додати `outputSchema` до інструментів WebMCP | `src/utils/webmcp.ts`, `src/utils/webmcp.test.ts` | Нульовий (прогресивне покращення) |
| **Низький (плановий)** | Додати `llms.txt` та `llms-full.txt` до `ai-catalog.json` | `public/.well-known/ai-catalog.json`, `scripts/sync-ai-catalog.mjs` | Нульовий |
| **Низький (рекомендований)** | Додати відкриті CORS заголовки для ШІ-ресурсів | `vercel.json` | Нульовий |
