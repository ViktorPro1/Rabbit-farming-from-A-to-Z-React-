import { useState } from "react";
import { Link } from "react-router-dom";
import { breedingBreeds, type BreedingBreed } from "../../data/breedingBreeds";
import "./Breeding.css";

const crossTable = [
  {
    female: "Каліфорнійська",
    male: "Новозеландський білий",
    goal: "М'ясо",
    result:
      "Класична комерційна пара. Швидкий приріст, гарна конверсія корму, рівний помет.",
    type: "excellent",
  },
  {
    female: "Новозеландська біла",
    male: "Каліфорнійський",
    goal: "М'ясо",
    result:
      "Зворотня комбінація — такий самий результат. Можна чергувати для уникнення інбридингу.",
    type: "excellent",
  },
  {
    female: "Радянська шиншила",
    male: "Каліфорнійський",
    goal: "М'ясо + хутро",
    result:
      "Добрий приріст з покращеною якістю шкурки. Популярна пара в українських господарствах.",
    type: "good",
  },
  {
    female: "Фландр",
    male: "Каліфорнійський",
    goal: "М'ясо (велике)",
    result:
      "Велика маса при народженні, але повільніший ріст. Добре для отримання великих тушок.",
    type: "good",
  },
  {
    female: "Віденський блакитний",
    male: "Новозеландський білий",
    goal: "М'ясо",
    result:
      "Хороший приріст, добра м'ясність. Нащадки мають змішане забарвлення.",
    type: "good",
  },
  {
    female: "Чорно-бурий",
    male: "Радянська шиншила",
    goal: "Хутро",
    result:
      "Цікаве поєднання для хутра. Нащадки можуть мати різне забарвлення — потребує селекційного відбору.",
    type: "ok",
  },
  {
    female: "Термонський",
    male: "Новозеландський білий",
    goal: "М'ясо",
    result:
      "Добра альтернатива каліфорнійській парі. Спокійний характер нащадків, рівний ріст.",
    type: "good",
  },
  {
    female: "Будь-яка м'ясна",
    male: "Фландр",
    goal: "Збільшення маси",
    result:
      "Самець-фландр підвищує масу нащадків. Але помети менші, самки більше навантажені при вагітності.",
    type: "ok",
  },
];

const rules = [
  {
    icon: "⚖️",
    title: "Правило розміру",
    desc: "Самка завжди має бути більшою або рівною самцю за розміром. Якщо самець значно більший — ризик ускладнень при окролі через великих крільченят.",
  },
  {
    icon: "🧬",
    title: "Уникати інбридингу",
    desc: "Не схрещувати братів і сестер, батька з донькою, матір з сином. Інбридинг знижує імунітет, підвищує смертність молодняку та закріплює дефекти.",
  },
  {
    icon: "📋",
    title: "Вести облік",
    desc: "Фіксуйте кожну злучку: дата, самка, самець, дата окролу, кількість крільченят, виживаність. Без записів неможливо відстежити ефективність пар.",
  },
  {
    icon: "🔄",
    title: "Чергувати самців",
    desc: "Один самець не повинен покривати більше 5–7 самок на тиждень. Чергуйте самців між групами для підтримки якості сперми та уникнення виснаження.",
  },
  {
    icon: "🏆",
    title: "Відбір плідників",
    desc: "Для розведення залишати кращих за приростом, здоров'ям та характером. Самець передає якості всьому поголів'ю — він важливіший за будь-яку самку.",
  },
  {
    icon: "⏱️",
    title: "Вік при першій злучці",
    desc: "Дрібні породи — від 4 міс., середні — від 5 міс., великі (фландр) — від 6–7 міс. Рання злучка знижує продуктивність і скорочує термін використання самки.",
  },
];

const goals = [
  {
    goal: "🥩 Максимальна м'ясна продуктивність",
    pairs:
      "Каліфорнійська × Новозеландський білий — класика. Термонський × Новозеландський білий — альтернатива.",
    note: "Забій на 70–90 день при масі 2.2–2.8 кг живої ваги.",
  },
  {
    goal: "📏 Велика маса тушки",
    pairs: "Будь-яка м'ясна самка × Фландр або Велетень.",
    note: "Довший відгодівельний період (90–120 днів), більші витрати корму.",
  },
  {
    goal: "🧴 М'ясо + якісна шкурка",
    pairs: "Радянська шиншила × Каліфорнійський. Рекс × Новозеландський білий.",
    note: "Компроміс між м'ясністю та якістю хутра.",
  },
  {
    goal: "🌿 Витривалість та здоров'я",
    pairs: "Місцеві аборигенні породи × будь-яка чиста порода.",
    note: "Перше покоління гібридів завжди витриваліше за чисті породи (гетерозис).",
  },
];

const forBeginners = [
  {
    icon: "❓",
    title: "Що таке схрещування простими словами?",
    desc: 'Схрещування — це коли самку однієї породи спаровують із самцем іншої породи. Нащадки від такої пари будуть "змішаними" — вони беруть кращі риси від обох батьків. Це як взяти швидкого татка і здорову маму — дитина буде і швидкою, і здоровою.',
  },
  {
    icon: "🐇",
    title: "Навіщо це робити?",
    desc: "Чисті породи красиві, але часто слабші. Змішані кролики (гібриди) ростуть швидше, хворіють рідше і краще переживають холод та спеку. Для господарства це означає менше витрат і більше м'яса.",
  },
  {
    icon: "🥇",
    title: "Яку пару вибрати?",
    desc: "Залежить від мети. Хочеш м'яса — бери двох м'ясних. Хочеш і м'яса і хутра — бери м'ясного самця і хутрову самку. Не знаєш — скористайся калькулятором нижче, він підкаже.",
  },
  {
    icon: "📏",
    title: "Головне правило розміру",
    desc: "Самка завжди має бути більшою або такою ж як самець. Якщо самець набагато більший — крільченята народяться великими і самці буде важко їх народити. Це найпоширеніша помилка початківців.",
  },
];

const generationTerms = [
  {
    term: "F1",
    full: "Перше покоління гібридів",
    desc: 'Діти від схрещування двох чистих порід. Наприклад: мама — Каліфорнійська, тато — Новозеландський білий. Їхні діти — це F1. Саме F1 найсильніші і найшвидше ростуть — це і є "гібридна сила" або гетерозис.',
    example: "Каліфорнійська × Новозеландський → діти F1",
    badge: "Найкращі для відгодівлі",
    badgeType: "excellent",
  },
  {
    term: "F2",
    full: "Друге покоління гібридів",
    desc: "Діти від двох гібридів F1. Тобто якщо схрещувати між собою двох кроликів F1 — отримаємо F2. Вони вже слабші за F1, гетерозис зменшується. Забарвлення та характеристики стають непередбачуваними.",
    example: "F1 × F1 → діти F2",
    badge: "Менш передбачувані",
    badgeType: "ok",
  },
  {
    term: "Чиста порода",
    full: "Тварини однієї породи з відомим походженням",
    desc: "Кролик чистої породи — це коли і мама, і тато, і дідусь з бабусею — всі тієї ж породи. Такі тварини передбачувані за характеристиками, але часто менш витривалі ніж гібриди.",
    example: "Каліфорнійська × Каліфорнійська → чиста порода",
    badge: "Для племінної роботи",
    badgeType: "good",
  },
  {
    term: "Гетерозис",
    full: "Гібридна сила",
    desc: "Явище коли гібрид (F1) перевершує обох батьків за приростом, здоров'ям та виживаністю. Це не магія — це біологія. Саме тому більшість промислових господарств у світі використовують гібриди, а не чисті породи.",
    example: "F1 росте на 10–20% швидше ніж чисті породи",
    badge: "Ключова перевага схрещування",
    badgeType: "excellent",
  },
];

function evaluatePair(female: BreedingBreed, male: BreedingBreed) {
  const sizeProblem = male.weightNum > female.weightNum + 3;

  if (sizeProblem) {
    return {
      rating: "warn" as const,
      goal: "",
      result:
        "Самець значно більший за самку — ризик ускладненого окролу через великих крільченят.",
      advice: "Краще замінити самця на меншого або вибрати більшу самку.",
      percent: 20,
      percentLabel: "Низький потенціал",
      reasons: [
        {
          icon: "⚠️",
          text: "Різниця у вазі понад 3 кг — ризик для самки при окролі",
        },
        { icon: "⚠️", text: "Крільченята можуть бути надто великими" },
        { icon: "⚠️", text: "Складний окріл збільшує смертність молодняку" },
      ],
    };
  }

  if (female.type === "meat" && male.type === "meat") {
    return {
      rating: "excellent" as const,
      goal: "М'ясо",
      result:
        "Відмінна м'ясна пара! Гібриди F1 матимуть швидкий приріст та хорошу конверсію корму.",
      advice: "Забій на 70–90 день при масі 2.2–2.8 кг живої ваги.",
      percent: 95,
      percentLabel: "Відмінний потенціал",
      reasons: [
        {
          icon: "✅",
          text: "Обидві породи м'ясного напряму — максимальний приріст",
        },
        { icon: "✅", text: "Гетерозис F1 дає +10–20% до швидкості росту" },
        {
          icon: "✅",
          text: "Висока конверсія корму — менше витрат на кілограм м'яса",
        },
        { icon: "✅", text: "Стабільні однорідні помети" },
      ],
    };
  }

  if (female.type === "meat" && male.type === "universal") {
    return {
      rating: "good" as const,
      goal: "М'ясо",
      result:
        "Хороша пара для м'яса. Нащадки матимуть добрий приріст з міцнішим здоров'ям.",
      advice: "Підходить для невеликих господарств де важлива витривалість.",
      percent: 75,
      percentLabel: "Хороший потенціал",
      reasons: [
        {
          icon: "✅",
          text: "М'ясна самка забезпечує гарну молочність і великі помети",
        },
        {
          icon: "✅",
          text: "Універсальний самець додає витривалості нащадкам",
        },
        {
          icon: "➖",
          text: "Приріст дещо нижчий ніж при двох м'ясних породах",
        },
      ],
    };
  }

  if (female.type === "universal" && male.type === "meat") {
    return {
      rating: "good" as const,
      goal: "М'ясо",
      result: "Добра пара. Самець покращить м'ясні показники нащадків.",
      advice: "Відбирайте кращих самців F1 для подальшого розведення.",
      percent: 75,
      percentLabel: "Хороший потенціал",
      reasons: [
        { icon: "✅", text: "М'ясний самець передає гени швидкого приросту" },
        { icon: "✅", text: "Витривала самка знижує ризик хвороб молодняку" },
        {
          icon: "➖",
          text: "Помети можуть бути меншими ніж у чисто м'ясних самок",
        },
      ],
    };
  }

  if (female.type === "universal" && male.type === "universal") {
    return {
      rating: "good" as const,
      goal: "Універсальний",
      result:
        "Збалансована пара. Нащадки будуть витривалими з хорошими показниками і м'яса і хутра.",
      advice:
        "Ведіть записи щоб оцінити ефективність цієї пари у вашому господарстві.",
      percent: 70,
      percentLabel: "Хороший потенціал",
      reasons: [
        {
          icon: "✅",
          text: "Обидві породи витривалі — низька смертність молодняку",
        },
        { icon: "✅", text: "Непогана якість хутра і м'яса одночасно" },
        {
          icon: "➖",
          text: "Немає вираженої спеціалізації — середні показники по всьому",
        },
      ],
    };
  }

  if (female.type === "fur" && male.type === "fur") {
    return {
      rating: "good" as const,
      goal: "Хутро",
      result:
        "Хутрова пара. Нащадки матимуть якісне хутро, але меншу масу тушки.",
      advice: "Стежте за якістю підстилки — аміак псує колір хутра.",
      percent: 72,
      percentLabel: "Хороший потенціал",
      reasons: [
        { icon: "✅", text: "Відмінна якість хутра від обох батьків" },
        { icon: "✅", text: "Густий підшерсток та рівне забарвлення нащадків" },
        {
          icon: "➖",
          text: "Мала маса тушки — невигідно для м'ясного напряму",
        },
      ],
    };
  }

  if (female.type === "fur" && male.type === "meat") {
    return {
      rating: "good" as const,
      goal: "Хутро + м'ясо",
      result:
        "Комбінована пара. Нащадки матимуть кращу масу ніж чисті хутрові та якісніше хутро ніж чисті м'ясні.",
      advice: "Популярна комбінація в українських господарствах.",
      percent: 78,
      percentLabel: "Хороший потенціал",
      reasons: [
        { icon: "✅", text: "М'ясний самець підвищує масу тушки нащадків" },
        { icon: "✅", text: "Хутрова самка передає якісну шкурку" },
        { icon: "✅", text: "Гетерозис дає витривалість і швидший ріст" },
        { icon: "➖", text: "Хутро гірше ніж у чистих хутрових порід" },
      ],
    };
  }

  if (female.type === "meat" && male.type === "fur") {
    return {
      rating: "ok" as const,
      goal: "М'ясо + хутро",
      result:
        "Прийнятна комбінація. М'ясні показники будуть дещо нижчими ніж при чисто м'ясній парі.",
      advice:
        "Краще використовувати м'ясного самця для максимального приросту.",
      percent: 50,
      percentLabel: "Прийнятний потенціал",
      reasons: [
        { icon: "✅", text: "М'ясна самка забезпечує хорошу молочність" },
        {
          icon: "➖",
          text: "Хутровий самець знижує м'ясні показники нащадків",
        },
        { icon: "➖", text: "Непередбачувана якість хутра у нащадків" },
      ],
    };
  }

  return {
    rating: "ok" as const,
    goal: "Універсальний",
    result: "Прийнятна пара. Нащадки будуть витривалими завдяки гетерозису.",
    advice: "Ведіть записи щоб оцінити ефективність цієї пари.",
    percent: 45,
    percentLabel: "Прийнятний потенціал",
    reasons: [
      { icon: "✅", text: "Гетерозис забезпечує базову витривалість нащадків" },
      {
        icon: "➖",
        text: "Немає чіткої спеціалізації — результат непередбачуваний",
      },
      {
        icon: "➖",
        text: "Рекомендується підібрати більш цілеспрямовану пару",
      },
    ],
  };
}

const ratingLabel: Record<string, string> = {
  excellent: "🏆 Відмінна пара",
  good: "✅ Хороша пара",
  ok: "👍 Прийнятна пара",
  warn: "⚠️ Увага",
};

const Breeding = () => {
  const [female, setFemale] = useState("");
  const [male, setMale] = useState("");
  const [pairResult, setPairResult] = useState<ReturnType<
    typeof evaluatePair
  > | null>(null);

  const selectedFemale = breedingBreeds.find((b) => b.id === female);
  const selectedMale = breedingBreeds.find((b) => b.id === male);

  const handleEvaluate = () => {
    if (!selectedFemale || !selectedMale) return;
    if (selectedFemale.id === selectedMale.id) {
      setPairResult({
        rating: "warn",
        goal: "",
        result:
          "Не можна схрещувати тварин однієї лінії без контролю інбридингу.",
        advice: "Оберіть різні породи для кращого результату.",
        percent: 10,
        percentLabel: "Не рекомендовано",
        reasons: [
          { icon: "⚠️", text: "Та сама порода — ризик інбридингу" },
          { icon: "⚠️", text: "Гетерозис відсутній — немає гібридної сили" },
          { icon: "⚠️", text: "Закріплення дефектів у нащадків" },
        ],
      });
      return;
    }
    setPairResult(evaluatePair(selectedFemale, selectedMale));
  };

  return (
    <main className="breeding-page">
      <div className="breeding-header">
        <h1>Схрещування порід кроликів</h1>
        <p>Які породи з якими спарювати — практичний довідник господаря</p>
      </div>

      <div className="breeding-wrap">
        <div className="breeding-note">
          <h2>Чому схрещування краще чистих порід?</h2>
          <p>
            Більшість господарів в Україні тримають не чисті породи, а їхні
            помісі — і це правильно. Перше покоління гібридів (F1) завжди
            перевершує батьківські породи за приростом, витривалістю та
            виживаністю молодняку. Це явище називається{" "}
            <strong>гетерозис</strong>, або «гібридна сила».
          </p>
          <p>
            Головне — правильно підібрати пари під конкретну мету: м'ясо, хутро
            або комбінований напрям.
          </p>
          <div className="breeding-alert ok">
            ✅ Гібриди F1 ростуть на 10–20% швидше чистих порід при тих самих
            витратах корму.
          </div>
        </div>

        {/* ДЛЯ ПОЧАТКІВЦЯ */}
        <div className="breeding-section-title">
          🌱 Для початківця — просто про складне
        </div>
        <div className="breeding-beginners-grid">
          {forBeginners.map((item) => (
            <article key={item.title} className="breeding-beginner-card">
              <span className="breeding-beginner-icon">{item.icon}</span>
              <div>
                <strong className="breeding-beginner-title">
                  {item.title}
                </strong>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* ЩО ТАКЕ F1, F2 */}
        <div className="breeding-section-title">
          🧬 Що таке F1, F2 та гетерозис
        </div>
        <div className="breeding-generations">
          {generationTerms.map((item) => (
            <article key={item.term} className="breeding-gen-card">
              <div className="breeding-gen-header">
                <span className="breeding-gen-term">{item.term}</span>
                <span className={`breeding-badge ${item.badgeType}`}>
                  {item.badge}
                </span>
              </div>
              <div className="breeding-gen-full">{item.full}</div>
              <p className="breeding-gen-desc">{item.desc}</p>
              <div className="breeding-gen-example">📌 {item.example}</div>
            </article>
          ))}
        </div>

        {/* ПІДБІР ПАРИ */}
        <div className="breeding-section-title">🔍 Підібрати пару</div>
        <div className="breeding-matcher">
          <div className="breeding-matcher-selects">
            <div className="breeding-select-wrap">
              <label className="breeding-select-label">♀ Самка</label>
              <select
                className="breeding-select"
                value={female}
                onChange={(e) => {
                  setFemale(e.target.value);
                  setPairResult(null);
                }}
              >
                <option value="">Оберіть породу самки</option>
                {breedingBreeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.weight})
                  </option>
                ))}
              </select>
            </div>

            <div className="breeding-matcher-arrow">×</div>

            <div className="breeding-select-wrap">
              <label className="breeding-select-label">♂ Самець</label>
              <select
                className="breeding-select"
                value={male}
                onChange={(e) => {
                  setMale(e.target.value);
                  setPairResult(null);
                }}
              >
                <option value="">Оберіть породу самця</option>
                {breedingBreeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.weight})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="breeding-matcher-btn"
            onClick={handleEvaluate}
            disabled={!female || !male}
          >
            Оцінити пару
          </button>

          {pairResult && (
            <div className={`breeding-matcher-result ${pairResult.rating}`}>
              <div className="breeding-matcher-rating">
                {ratingLabel[pairResult.rating]}
              </div>
              {pairResult.goal && (
                <div className="breeding-matcher-goal">
                  Мета: {pairResult.goal}
                </div>
              )}

              <div className="breeding-percent-wrap">
                <div className="breeding-percent-header">
                  <span className="breeding-percent-label">
                    {pairResult.percentLabel}
                  </span>
                  <span className="breeding-percent-value">
                    {pairResult.percent}%
                  </span>
                </div>
                <div className="breeding-percent-bar-wrap">
                  <div
                    className={`breeding-percent-bar ${pairResult.rating}`}
                    style={{ width: `${pairResult.percent}%` }}
                  />
                </div>
              </div>

              <p className="breeding-matcher-main">{pairResult.result}</p>

              <div className="breeding-reasons">
                {pairResult.reasons.map((r, i) => (
                  <div key={i} className="breeding-reason-row">
                    <span>{r.icon}</span>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>

              <p className="breeding-matcher-advice">💡 {pairResult.advice}</p>
            </div>
          )}
        </div>

        {/* ТАБЛИЦЯ СХРЕЩУВАНЬ */}
        <div className="breeding-section-title">
          🔄 Рекомендовані пари для схрещування
        </div>
        <div className="breeding-table-wrap">
          <table className="breeding-table">
            <thead>
              <tr>
                <th>Самка (♀)</th>
                <th>Самець (♂)</th>
                <th>Мета</th>
                <th>Результат</th>
              </tr>
            </thead>
            <tbody>
              {crossTable.map((row) => (
                <tr key={row.female + row.male}>
                  <td>
                    <strong>{row.female}</strong>
                  </td>
                  <td>{row.male}</td>
                  <td>
                    <span className={`breeding-badge ${row.type}`}>
                      {row.goal}
                    </span>
                  </td>
                  <td>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* МЕТА */}
        <div className="breeding-section-title">🎯 Підбір пари за метою</div>
        <div className="breeding-goals">
          {goals.map((g) => (
            <div key={g.goal} className="breeding-goal-card">
              <div className="breeding-goal-title">{g.goal}</div>
              <p>
                <strong>Пари:</strong> {g.pairs}
              </p>
              <p>{g.note}</p>
            </div>
          ))}
        </div>

        {/* ПРАВИЛА */}
        <div className="breeding-section-title">
          📌 Основні правила підбору пар
        </div>
        <div className="breeding-rules-grid">
          {rules.map((r) => (
            <article key={r.title} className="breeding-rule-card">
              <span className="breeding-rule-icon">{r.icon}</span>
              <div>
                <strong className="breeding-rule-title">{r.title}</strong>
                <p>{r.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* ЧОГО УНИКАТИ */}
        <div className="breeding-section-title">
          🚫 Чого уникати при схрещуванні
        </div>
        <div className="breeding-note">
          <ul>
            <li>
              <strong>Схрещування двох великих порід між собою</strong> —
              крільченята можуть бути надто великими для самки, ускладнений
              окріл.
            </li>
            <li>
              <strong>Схрещування декоративних порід з м'ясними</strong> —
              нащадки непередбачувані за розміром та характером, низька
              продуктивність.
            </li>
            <li>
              <strong>Використання хворих або виснажених тварин</strong> —
              хвороби та слабкість передаються нащадкам через знижений імунітет
              батьків.
            </li>
            <li>
              <strong>Злучка спорідненіх тварин (інбридинг)</strong> — навіть
              через одне покоління помітне зниження якості посліду.
            </li>
            <li>
              <strong>Схрещування тварин різного віку без контролю</strong> —
              стара самка + молодий самець або навпаки знижує результативність
              злучки.
            </li>
            <li>
              <strong>Використання одного самця на все поголів'я</strong> —
              через 1–2 покоління весь виводок стає спорідненим.
            </li>
          </ul>
          <div className="breeding-alert warn">
            ⚠️ Оновлюйте самців кожні 2–3 роки або обмінюйтеся плідниками з
            перевіреними господарями.
          </div>
        </div>

        {/* ЗАПИС */}
        <div className="breeding-section-title">📓 Що фіксувати в записах</div>
        <div className="breeding-note">
          <ul>
            <li>
              <strong>Дата злучки</strong> — від неї рахується вагітність і
              готують маточник.
            </li>
            <li>
              <strong>Номер або кличка самки і самця</strong> — щоб відстежити
              які пари дають кращі результати.
            </li>
            <li>
              <strong>Дата окролу</strong> — контроль тривалості вагітності.
            </li>
            <li>
              <strong>Кількість крільченят</strong> — живих і мертвих окремо.
            </li>
            <li>
              <strong>Виживаність до відлучення</strong> — ключовий показник
              якості самки і пари.
            </li>
            <li>
              <strong>Середня маса при відлученні</strong> — показник молочності
              самки і потенціалу пари.
            </li>
            <li>
              <strong>Маса при забої</strong> — фінальний показник ефективності
              схрещування.
            </li>
          </ul>
          <div className="breeding-alert ok">
            ✅ Навіть простий зошит з такими записами дозволить через рік точно
            знати які пари найефективніші саме у вашому господарстві.
          </div>
        </div>

        <div className="breeding-back">
          <Link to="/" className="breeding-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Breeding;
