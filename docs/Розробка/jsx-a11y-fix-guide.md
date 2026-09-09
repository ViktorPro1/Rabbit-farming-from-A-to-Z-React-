# jsx-a11y: 210 помилок — план дій

## Крок 1. Перевести з error на warn

У `recommended` preset все йде як `error`, тому будь-який запуск лінту (і плагін ESLint у VS Code) показує це як критичну помилку. Для соло-проєкту, де це не блокер, розумніше почати з `warn` — лінт буде підсвічувати проблеми жовтим, не ламаючи нічого, і ти виправлятимеш поступово, заходячи у файли.

Онови `eslint.config.js`:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Знижуємо суворість a11y-правил до warn, щоб не блокувати білд/лінт.
      // Виправляємо поступово, файл за файлом.
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/aria-role': 'warn',
    },
  },
])
```

Після цього `npx eslint . --ext .tsx` покаже ті самі 210 попереджень, але жовтим і без коду виходу з помилкою — можеш і далі комітити код.

## Крок 2. Три шаблони, які закривають ~90% списку

### A. `label-has-associated-control` (форми — найбільше помилок)

Найчастіша причина: `<label>Текст</label>` стоїть поруч з `<input>`, але нічим не пов'язаний.

**Було:**
```tsx
<label>Ім'я</label>
<input value={name} onChange={e => setName(e.target.value)} />
```

**Стало (варіант 1 — через htmlFor/id):**
```tsx
<label htmlFor="name">Ім'я</label>
<input id="name" value={name} onChange={e => setName(e.target.value)} />
```

**Стало (варіант 2 — обгорнути input у label, id не потрібен):**
```tsx
<label>
  Ім'я
  <input value={name} onChange={e => setName(e.target.value)} />
</label>
```

Варіант 2 швидше вставляти масово, якщо тобі не критично мати окремий `id` для стилізації.

### B. `click-events-have-key-events` + `no-static-element-interactions` (клікабельні div/span)

Найчастіша причина: `<div onClick={...}>` замість кнопки — наприклад, картка, що відкриває модалку, або фон модалки, що закриває її по кліку.

**Було:**
```tsx
<div className="card" onClick={openDetails}>
  ...
</div>
```

**Стало (якщо це справді кнопка за змістом):**
```tsx
<button type="button" className="card" onClick={openDetails}>
  ...
</button>
```
`<button>` можна стилізувати як завгодно (`background: none; border: none; padding: 0` для скидання дефолтних стилів), і клавіатура/скрінрідери запрацюють автоматично — без ручного `onKeyDown`.

**Якщо button не підходить за версткою (напр. div має бути в display: grid/flex як контейнер, а не inline-елемент):**
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={openDetails}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') openDetails()
  }}
>
  ...
</div>
```

**Для фону модалки (клік поза контентом закриває її)** — це не інтерактивний елемент за змістом, тому найпростіше додати `role="presentation"` і придушити правило прицільно:
```tsx
{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
<div className="overlay" onClick={onClose} role="presentation">
```
Закриття по Escape зазвичай реалізують окремим `useEffect` з `keydown`-листенером на `document` — це і є "клавіатурна" альтернатива для модалок.

### C. `no-autofocus`

Якщо autoFocus зроблений навмисно (наприклад, фокус на першому полі при відкритті модалки — це нормальний UX-патерн), просто придуши правило локально, а не видаляй функціонал:
```tsx
{/* eslint-disable-next-line jsx-a11y/no-autofocus */}
<input autoFocus value={...} onChange={...} />
```

## Крок 3. Порядок роботи

`npx eslint . --ext .tsx --fix` тут не допоможе — a11y-помилки майже завжди правляться вручну (autofix для цих правил не існує).

Раджу не сідати виправляти всі 210 одразу, а брати по 1 файлу, коли туди заходиш з іншої задачі. Найбільше сенсу мають форми з реальними даними (`FinancesPage`, `Matings`, `BreedingHerd`, `MyTreatments`, `Weighing`, `Calculator`) — там `label`/`input` зв'язки реально покращують автозаповнення в браузері. Декоративні клікабельні картки на інформаційних сторінках (`RabbitMyths`, `Glossary`, `HalfSiblings` тощо) можна відкласти в кінець списку.
