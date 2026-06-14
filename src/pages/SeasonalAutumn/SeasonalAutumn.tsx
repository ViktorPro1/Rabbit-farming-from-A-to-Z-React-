import { useState } from "react";
import { Link } from "react-router-dom";
import "./SeasonalAutumn.css";

type CheckKey = string;

const checklist: {
  category: string;
  icon: string;
  items: { id: CheckKey; text: string; note?: string }[];
}[] = [
  {
    category: "Вакцинація та профілактика",
    icon: "💉",
    items: [
      {
        id: "vacc-vghk",
        text: "Ревакцинація від ВГХК (якщо минуло 6–12 місяців)",
        note: "Осінь — оптимальний час перед зимовим стресом",
      },
      {
        id: "vacc-mix",
        text: "Ревакцинація від міксоматозу",
        note: "Імунітет діє 6–12 місяців залежно від препарату",
      },
      {
        id: "dehel",
        text: "Дегельмінтизація всього поголів'я",
        note: "Фенбендазол або івермектин за призначенням ветеринара",
      },
      {
        id: "cocci",
        text: "Профілактична пропойка молодняку від кокцидіозу",
        note: "Якщо є молодняк 4–12 тижнів",
      },
    ],
  },
  {
    category: "Утеплення та мікроклімат",
    icon: "🌡️",
    items: [
      {
        id: "draft",
        text: "Перевір і закрий протяги — особливо з боку переважних вітрів",
        note: "Протяг небезпечніший за мороз",
      },
      {
        id: "nest",
        text: "Підготуй маточники для зимових окролів — перевір цілісність",
        note: "Утеплення стружкою або сіном",
      },
      {
        id: "insul",
        text: "Утепли шеди або кролятник — мінімум +5°C навіть у мороз",
      },
      {
        id: "light",
        text: "Перевір освітлення — світловий день для самок мінімум 14 годин",
        note: "Коротший день знижує репродуктивність",
      },
    ],
  },
  {
    category: "Поїлки та вода",
    icon: "💧",
    items: [
      {
        id: "water-heat",
        text: "Підключи або підготуй обігрів поїлок / ніпелів",
      },
      {
        id: "water-check",
        text: "Перевір ніпельні поїлки — замінник до морозів якщо тріщини",
        note: "Пластик розтріскується при замерзанні",
      },
      {
        id: "water-freq",
        text: "Взимку перевіряй воду двічі на день — кролі без води гинуть за добу",
      },
    ],
  },
  {
    category: "Корм і запаси",
    icon: "🥕",
    items: [
      {
        id: "hay",
        text: "Перевір запаси сіна — мінімум на 3–4 місяці вперед",
        note: "Взимку сіно складає більшу частку раціону",
      },
      {
        id: "grain",
        text: "Збільш частку зернових у раціоні — +10–15% від літнього",
        note: "Додаткова енергія на терморегуляцію",
      },
      {
        id: "vitd",
        text: "Додай вітамін D3 або Чіктонік — дефіцит через відсутність сонця",
        note: "Особливо для закритих приміщень",
      },
      {
        id: "green",
        text: "Поступово скорочуй свіжу зелень до мінімуму",
        note: "Різка відмова — стрес для ШКТ",
      },
    ],
  },
  {
    category: "Гігієна та дезінфекція",
    icon: "🧴",
    items: [
      {
        id: "disinfect",
        text: "Повна дезінфекція кліток та обладнання до зими",
        note: "Бровадез, Вірокон або аналоги за інструкцією",
      },
      {
        id: "rodents",
        text: "Перевір захист від гризунів — щури активніші восени",
        note: "Переносять пастерельоз та інші інфекції",
      },
      { id: "bedding", text: "Забезпеч запас підстилки — взимку треба більше" },
    ],
  },
  {
    category: "Розведення",
    icon: "🍼",
    items: [
      {
        id: "breed-plan",
        text: "Сплануй зимові окроли — для кожної самки вирахуй дату злучки",
        note: "Крільченята при морозі потребують теплих маточників",
      },
      {
        id: "buck-check",
        text: "Перевір кондицію плідника — після літньої спеки можливе тимчасове безпліддя",
        note: "Якість сперми відновлюється через 6–8 тижнів після стресу",
      },
      {
        id: "doe-cond",
        text: "Оціни BCS самок перед злучкою — ні худих, ні ожирілих",
      },
    ],
  },
];

const SeasonalAutumn = () => {
  const [checked, setChecked] = useState<Record<CheckKey, boolean>>({});

  const toggle = (id: CheckKey) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = checklist.reduce((acc, c) => acc + c.items.length, 0);
  const doneItems = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <main className="sa-page">
      <div className="sa-back">
        <Link to="/" className="sa-back-link">
          ← Головна
        </Link>
      </div>

      <div className="sa-hero">
        <span>🍂</span>
        <h1>Осінь: підготовка до холодів</h1>
        <p>Що зробиш у вересні–жовтні — визначить як перезимуєш</p>
      </div>

      {/* PROGRESS */}
      <div className="sa-progress-wrap">
        <div className="sa-progress-header">
          <span className="sa-progress-label">
            Виконано: {doneItems} з {totalItems} пунктів
          </span>
          <span className="sa-progress-pct">{pct}%</span>
        </div>
        <div className="sa-progress-bar">
          <div className="sa-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        {pct === 100 && (
          <div className="sa-progress-done">✓ Господарство готове до зими!</div>
        )}
      </div>

      {/* CHECKLIST */}
      <div className="sa-checklist">
        {checklist.map((cat) => {
          const catDone = cat.items.filter((i) => checked[i.id]).length;
          return (
            <div key={cat.category} className="sa-category">
              <div className="sa-cat-header">
                <span className="sa-cat-icon">{cat.icon}</span>
                <h2 className="sa-cat-title">{cat.category}</h2>
                <span className="sa-cat-count">
                  {catDone}/{cat.items.length}
                </span>
              </div>
              <div className="sa-items">
                {cat.items.map((item) => (
                  <label
                    key={item.id}
                    className={`sa-item${checked[item.id] ? " sa-item--done" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="sa-checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                    />
                    <div className="sa-item-body">
                      <span className="sa-item-text">{item.text}</span>
                      {item.note && (
                        <span className="sa-item-note">{item.note}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sa-links">
        <span>📎</span>
        <span>
          Пов'язані розділи: <Link to="/microclimate">Мікроклімат</Link> ·{" "}
          <Link to="/water">Водопостачання</Link> ·{" "}
          <Link to="/vaccinations">Вакцинація</Link> ·{" "}
          <Link to="/winter-litter">Зимовий окріл</Link>
        </span>
      </div>
    </main>
  );
};

export default SeasonalAutumn;
