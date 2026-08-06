# Toast — шаблон підключення

## 1. Імпорти

```tsx
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../hooks/useToast";
```

## 2. Хук (всередині компонента)

```tsx
const { message, type, visible, showToast } = useToast();
```

## 3. Виклик

```tsx
// успіх
showToast("Збережено", "success");

// помилка
showToast("Помилка збереження", "error");
```

## 4. JSX (в кінці return, перед закриваючим div)

```tsx
<Toast message={message} type={type} visible={visible} />
```

## Приклад повного використання

```tsx
const { message, type, visible, showToast } = useToast();

async function handleSave() {
  const { error } = await supabase.from("...").update(...);
  if (error) {
    showToast("Помилка збереження", "error");
  } else {
    showToast("Збережено", "success");
  }
}

return (
  <div>
    <Toast message={message} type={type} visible={visible} />
    {/* решта JSX */}
  </div>
);
```

## Шляхи файлів

```
src/
  components/
    Toast/
      Toast.tsx
      Toast.css
  hooks/
    useToast.ts
```
