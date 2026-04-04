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

function evaluatePair(female: BreedingBreed, male: BreedingBreed) {
  const sizeProblem = male.weightNum > female.weightNum + 3;

  if (sizeProblem) {
    return {
      rating: "warn" as const,
      goal: "",
      result:
        "Самець значно більший за самку — ризик ускладненого окролу через великих крільченят.",
      advice: "Краще замінити самця на меншого або вибрати більшу самку.",
    };
  }

  if (female.type === "meat" && male.type === "meat") {
    return {
      rating: "excellent" as const,
      goal: "М'ясо",
      result:
        "Відмінна м'ясна пара! Гібриди F1 матимуть швидкий приріст та хорошу конверсію корму.",
      advice: "Забій на 70–90 день при масі 2.2–2.8 кг живої ваги.",
    };
  }

  if (female.type === "meat" && male.type === "universal") {
    return {
      rating: "good" as const,
      goal: "М'ясо",
      result:
        "Хороша пара для м'яса. Нащадки матимуть добрий приріст з міцнішим здоров'ям.",
      advice: "Підходить для невеликих господарств де важлива витривалість.",
    };
  }

  if (female.type === "universal" && male.type === "meat") {
    return {
      rating: "good" as const,
      goal: "М'ясо",
      result: "Добра пара. Самець покращить м'ясні показники нащадків.",
      advice: "Відбирайте кращих самців F1 для подальшого розведення.",
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
    };
  }

  if (female.type === "fur" && male.type === "fur") {
    return {
      rating: "good" as const,
      goal: "Хутро",
      result:
        "Хутрова пара. Нащадки матимуть якісне хутро, але меншу масу тушки.",
      advice: "Стежте за якістю підстилки — аміак псує колір хутра.",
    };
  }

  if (female.type === "fur" && male.type === "meat") {
    return {
      rating: "good" as const,
      goal: "Хутро + м'ясо",
      result:
        "Комбінована пара. Нащадки матимуть кращу масу ніж чисті хутрові та якісніше хутро ніж чисті м'ясні.",
      advice: "Популярна комбінація в українських господарствах.",
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
    };
  }

  return {
    rating: "ok" as const,
    goal: "Універсальний",
    result: "Прийнятна пара. Нащадки будуть витривалими завдяки гетерозису.",
    advice: "Ведіть записи щоб оцінити ефективність цієї пари.",
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
              <p>{pairResult.result}</p>
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
