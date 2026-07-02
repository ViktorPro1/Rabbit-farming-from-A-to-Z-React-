import { useState } from "react";
import "./ShowScoring.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

type ScoringSystem = "arba" | "brc" | "zdrk";
type ExhibitionClass = "junior" | "intermediate" | "senior" | "any";

interface ScoringOrg {
  id: ScoringSystem;
  name: string;
  country: string;
  founded: string;
  maxPoints: number;
  description: string;
  website: string;
}

interface ScoringCriterion {
  criterion: string;
  arbaPoints: number;
  brcPoints: number;
  zdrkPoints: number;
  description: string;
}

interface ExhibitionClass_ {
  id: ExhibitionClass;
  name: string;
  ageRange: string;
  weightNote: string;
  description: string;
}

interface AwardLevel {
  rank: number;
  title: string;
  titleUkr: string;
  minScore: number;
  description: string;
  color: string;
  bg: string;
}

interface JudgeAction {
  step: number;
  icon: string;
  action: string;
  detail: string;
  duration: string;
}

interface CommonMistake {
  mistake: string;
  consequence: string;
  prevention: string;
}

// ─── Data ────────────────────────────────────────────────────────
const scoringOrgs: ScoringOrg[] = [
  {
    id: "arba",
    name: "ARBA",
    country: "США",
    founded: "1910",
    maxPoints: 100,
    description:
      "American Rabbit Breeders Association — найбільша організація у світі. Стандарт оновлюється кожні 4 роки. Охоплює 50+ порід.",
    website: "arba.net",
  },
  {
    id: "brc",
    name: "BRC",
    country: "Велика Британія",
    founded: "1918",
    maxPoints: 100,
    description:
      "British Rabbit Council — британський стандарт. Окремі стандарти для кожної породи з детальними описами кольорів та малюнків.",
    website: "thebrc.org",
  },
  {
    id: "zdrk",
    name: "ZDRK / EE",
    country: "Німеччина / Європа",
    founded: "1925",
    maxPoints: 100,
    description:
      "Zentralverband Deutscher Rasse-Kaninchenzüchter + Entente Européenne (ЄЄ) — загальноєвропейський стандарт. Використовується в більшості країн Європи включно з Україною.",
    website: "zdrk.de",
  },
];

const scoringCriteria: ScoringCriterion[] = [
  {
    criterion: "Тип та будова тіла",
    arbaPoints: 35,
    brcPoints: 30,
    zdrkPoints: 30,
    description:
      "Загальна будова корпусу, відповідність силуету стандарту породи, м'язовий розвиток, пропорції частин тіла",
  },
  {
    criterion: "Голова та вуха",
    arbaPoints: 10,
    brcPoints: 15,
    zdrkPoints: 15,
    description:
      "Форма голови, правильність прикусу, форма, розмір та положення вух",
  },
  {
    criterion: "Хутро (щільність, текстура)",
    arbaPoints: 25,
    brcPoints: 20,
    zdrkPoints: 20,
    description:
      "Щільність покриву, довжина, текстура (особливо важливо для хутрових порід та рекс)",
  },
  {
    criterion: "Колір та малюнок",
    arbaPoints: 15,
    brcPoints: 20,
    zdrkPoints: 20,
    description:
      "Відповідність кольору та малюнку стандарту, насиченість, рівномірність",
  },
  {
    criterion: "Стан і кондиція",
    arbaPoints: 10,
    brcPoints: 10,
    zdrkPoints: 10,
    description:
      "Загальний стан здоров'я, кондиція тіла (BCS), чистота, стан кігтів та вух",
  },
  {
    criterion: "Вага",
    arbaPoints: 5,
    brcPoints: 5,
    zdrkPoints: 5,
    description: "Відповідність ваги стандарту для породи та вікової категорії",
  },
];

const exhibitionClasses: ExhibitionClass_[] = [
  {
    id: "junior",
    name: "Молодший клас (Junior)",
    ageRange: "до 6 місяців (ARBA) / до 5 місяців (BRC)",
    weightNote: "Не менше мінімальної ваги породи для цього класу",
    description:
      "Молодняк, що ще не досяг дорослого розміру. Оцінюється з поправкою на вік — не всі типові ознаки сформовані.",
  },
  {
    id: "intermediate",
    name: "Проміжний клас (Intermediate / 6–8 міс.)",
    ageRange: "6–8 місяців (деякі породи в ARBA)",
    weightNote: "Між вагою молодшого та старшого класу",
    description:
      "Перехідний клас для порід зі складним формуванням типу (великі породи, ангора). Не всі організації використовують цей клас.",
  },
  {
    id: "senior",
    name: "Старший клас (Senior)",
    ageRange: "від 6 місяців (ARBA) / від 5 місяців (BRC)",
    weightNote: "Має досягти мінімальної дорослої ваги за стандартом породи",
    description:
      "Дорослі тварини з повністю сформованим типом. Найбільш значущий клас для виставкових та племінних цілей.",
  },
];

const awardLevels: AwardLevel[] = [
  {
    rank: 1,
    title: "Best of Breed (BOB)",
    titleUkr: "Найкращий представник породи",
    minScore: 0,
    description:
      "Найвища нагорода — тварина визнана найкращим представником своєї породи на даному шоу. Обирається з переможців кожного класу і різновиду кольору.",
    color: "#8B6914",
    bg: "#FFF8E0",
  },
  {
    rank: 2,
    title: "Best Opposite Sex (BOS)",
    titleUkr: "Найкращий представник протилежної статі",
    minScore: 0,
    description:
      "Найкращий представник статі, протилежної до BOB. Якщо BOB — самець, то BOS — найкраща самка породи і навпаки.",
    color: "#5B5B8B",
    bg: "#EEEEFF",
  },
  {
    rank: 3,
    title: "Excellent / Відмінно",
    titleUkr: "Відмінно",
    minScore: 90,
    description:
      "90–100 балів. Тварина практично відповідає ідеалу стандарту. Дрібні недоліки допустимі. Рекомендується для розведення.",
    color: "#27500A",
    bg: "#EAF3DE",
  },
  {
    rank: 4,
    title: "Very Good / Дуже добре",
    titleUkr: "Дуже добре",
    minScore: 80,
    description:
      "80–89 балів. Добра тварина з незначними відхиленнями від стандарту. Підходить для розведення.",
    color: "#3B6D11",
    bg: "#C0DD97",
  },
  {
    rank: 5,
    title: "Good / Добре",
    titleUkr: "Добре",
    minScore: 70,
    description:
      "70–79 балів. Задовільна тварина. Має помітні недоліки. Використовувати в розведенні обережно.",
    color: "#BA7517",
    bg: "#FAEEDA",
  },
  {
    rank: 6,
    title: "Satisfactory / Задовільно",
    titleUkr: "Задовільно",
    minScore: 60,
    description:
      "60–69 балів. Серйозні недоліки. Не рекомендується для племінного розведення.",
    color: "#633806",
    bg: "#FFE8D0",
  },
  {
    rank: 7,
    title: "Disqualified / Дискваліфіковано",
    titleUkr: "Дискваліфіковано",
    minScore: 0,
    description:
      "Тварина має дискваліфікуючий дефект або ознаку хвороби. Знімається з оцінювання. 0 балів.",
    color: "#8B0000",
    bg: "#FFE0DE",
  },
];

const judgeProcess: JudgeAction[] = [
  {
    step: 1,
    icon: "👁",
    action: "Загальне враження",
    detail:
      "Суддя оглядає тварину на столі з відстані 30–50 см. Оцінює загальний силует, відповідність типу породи, рух та поведінку під час первинного огляду.",
    duration: "15–20 сек",
  },
  {
    step: 2,
    icon: "🖐",
    action: "Оцінка корпусу",
    detail:
      "Руки кладуть на спину тварини: ширина, глибина та довжина корпусу, розвиток поперекової зони. Прощупують круп та плечі. Оцінюють м'язовий розвиток задньої чверті.",
    duration: "30–45 сек",
  },
  {
    step: 3,
    icon: "🐰",
    action: "Голова та вуха",
    detail:
      "Огляд голови спереду та збоку. Перевірка прикусу: відкривають рот та перевіряють положення різців. Вуха — симетрія, розмір, положення, стан внутрішньої поверхні.",
    duration: "20–30 сек",
  },
  {
    step: 4,
    icon: "✨",
    action: "Хутро та колір",
    detail:
      "Проводять рукою проти та за ростом шерсті. Оцінюють щільність, текстуру, довжину. Перевіряють колір при природному освітленні — відповідність стандарту, рівномірність, насиченість.",
    duration: "30–40 сек",
  },
  {
    step: 5,
    icon: "🦵",
    action: "Кінцівки та хвіст",
    detail:
      "Огляд передніх лап спереду — постановка, прямолінійність. Задні лапи — м'язовий розвиток. Хвіст — положення та форма. Підошви — наявність шерсті, ознаки пододерматиту.",
    duration: "15–20 сек",
  },
  {
    step: 6,
    icon: "⚖️",
    action: "Зважування",
    detail:
      "Тварину зважують на точних вагах. Вага порівнюється зі стандартом породи для цієї вікової категорії. Надто мала або велика вага знижує оцінку або дискваліфікує.",
    duration: "15 сек",
  },
  {
    step: 7,
    icon: "📋",
    action: "Виставлення балів та коментар",
    detail:
      "Суддя заповнює суддівську картку: бали по кожному критерію, загальна сума, словесний коментар. При дискваліфікації — зазначається причина. Картка повертається власнику.",
    duration: "1–2 хв",
  },
];

const commonMistakes: CommonMistake[] = [
  {
    mistake: "Підготовка тварини в день виставки",
    consequence:
      "Хутро не встигає відновитись після миття або вичісування. Тварина в стресі від транспорту",
    prevention:
      "Готуйте хутро за 2–7 днів до шоу. Вичісування — 3–4 дні до виставки",
  },
  {
    mistake: "Приїзд безпосередньо перед оцінюванням",
    consequence:
      "Тварина не встигає заспокоїтись після транспорту. Стрес = поганий темперамент на столі",
    prevention:
      "Приїжджати мінімум за 2–3 години. Дати тварині воду та час відпочити",
  },
  {
    mistake: "Довгі або нерівні кігті",
    consequence: "Автоматичний мінус за кондицію. Знижує загальну оцінку",
    prevention:
      "Підстригти кігті за 7–10 днів до виставки (краще не в день шоу — ризик зрізати живий шар)",
  },
  {
    mistake: "Забруднені або з запахом вуха",
    consequence: "Дискваліфікація якщо є кірки — підозра на псороптоз",
    prevention:
      "Перевірити вуха за 3–5 днів. При необхідності — очистити ватою без глибокого введення",
  },
  {
    mistake: "Активна линька під час шоу",
    consequence: "Значне зниження оцінки хутра",
    prevention:
      "Слідкуйте за циклом линьки. Реєструйте на виставку через 4–6 тижнів після завершення",
  },
  {
    mistake: "Неправильна вікова категорія",
    consequence: "Дискваліфікація — тварина переведена в невідповідний клас",
    prevention:
      "Точно розрахуйте вік на день шоу. Зберігайте дату народження в документах",
  },
  {
    mistake: "Відсутність документів (родовід, ветпаспорт)",
    consequence: "Не допуск до виставки. Без родоводу — неможлива реєстрація",
    prevention:
      "Перелік документів уточнювати у організаторів заздалегідь. Мати копії",
  },
  {
    mistake: "Годування безпосередньо перед оглядом",
    consequence:
      "Роздутий живіт — видовжує силует, псує враження від типу корпусу",
    prevention: "Не годувати рясно за 3–4 години до оцінювання. Вода — завжди",
  },
];

const expertCardFields = [
  {
    field: "Назва породи та різновид кольору",
    example: "Новозеландський білий / White",
  },
  { field: "Клас (молодший / старший)", example: "Senior Buck" },
  { field: "Вухо (татуювання або номер)", example: "Ліве: 25А14" },
  { field: "Вага", example: "4,2 кг" },
  { field: "Тип та будова тіла (бали)", example: "30 / 35" },
  { field: "Голова та вуха (бали)", example: "9 / 10" },
  { field: "Хутро (бали)", example: "23 / 25" },
  { field: "Колір та малюнок (бали)", example: "14 / 15" },
  { field: "Стан та кондиція (бали)", example: "9 / 10" },
  { field: "Вага відповідає стандарту (бали)", example: "5 / 5" },
  { field: "Загальна сума", example: "90 / 100" },
  { field: "Оцінка словесна", example: "Відмінно" },
  {
    field: "Коментар судді",
    example:
      "Відмінний тип корпусу. Дещо вузька голова для самця. Хутро щільне, колір ідеальний.",
  },
  { field: "Підпис судді та дата", example: "Іваненко В.О., 15.06.2025" },
];

// ─── Component ───────────────────────────────────────────────────
export default function ShowScoring() {
  const [activeOrg, setActiveOrg] = useState<ScoringSystem>("arba");
  const [openJudge, setOpenJudge] = useState<number | null>(null);
  const [openMistake, setOpenMistake] = useState<number | null>(null);
  const [openAward, setOpenAward] = useState<number | null>(null);

  return (
    <div className="ss-page">
      <header className="ss-header">
        <h1>🥇 Система оцінювання кролів на виставках</h1>
        <p>
          Бали, критерії, робота судді, класи учасників та нагороди — повний гід
          від реєстрації до суддівської картки.
        </p>
      </header>

      <div className="ss-wrap">
        {/* ОРГАНІЗАЦІЇ */}
        <h2 className="ss-section-title">Міжнародні системи оцінювання</h2>
        <p className="ss-intro">
          Три основні організації зі своїми стандартами та системами балів
        </p>

        <div className="ss-org-tabs">
          {scoringOrgs.map((org) => (
            <button
              key={org.id}
              className={`ss-org-tab ${activeOrg === org.id ? "ss-org-tab--active" : ""}`}
              onClick={() => setActiveOrg(org.id)}
            >
              <span className="ss-org-name">{org.name}</span>
              <span className="ss-org-country">{org.country}</span>
            </button>
          ))}
        </div>

        {scoringOrgs
          .filter((o) => o.id === activeOrg)
          .map((org) => (
            <div key={org.id} className="ss-org-card">
              <div className="ss-org-info">
                <div className="ss-org-meta">
                  <span className="ss-org-badge">{org.name}</span>
                  <span className="ss-org-founded">з {org.founded} р.</span>
                  <span className="ss-org-max">
                    {org.maxPoints} балів максимум
                  </span>
                </div>
                <p className="ss-org-desc">{org.description}</p>
                <a
                  className="ss-org-link"
                  href={`https://${org.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐 {org.website}
                </a>
              </div>
            </div>
          ))}

        {/* ПОРІВНЯЛЬНА ТАБЛИЦЯ БАЛІВ */}
        <h2 className="ss-section-title">Порівняння критеріїв та балів</h2>
        <p className="ss-intro">
          Розподіл балів між основними системами оцінювання
        </p>
        <div className="ss-table-wrap">
          <table className="ss-table">
            <thead>
              <tr>
                <th>Критерій оцінки</th>
                <th>ARBA (США)</th>
                <th>BRC (Велика Британія)</th>
                <th>ZDRK / ЄЄ (Європа)</th>
                <th>Що перевіряють</th>
              </tr>
            </thead>
            <tbody>
              {scoringCriteria.map((c, i) => (
                <tr key={i}>
                  <td>
                    <strong>{c.criterion}</strong>
                  </td>
                  <td className="ss-td-points">{c.arbaPoints}</td>
                  <td className="ss-td-points">{c.brcPoints}</td>
                  <td className="ss-td-points">{c.zdrkPoints}</td>
                  <td className="ss-td-sm">{c.description}</td>
                </tr>
              ))}
              <tr className="ss-total-row">
                <td>
                  <strong>Всього</strong>
                </td>
                <td className="ss-td-points">
                  <strong>100</strong>
                </td>
                <td className="ss-td-points">
                  <strong>100</strong>
                </td>
                <td className="ss-td-points">
                  <strong>100</strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ss-note">
          <p>
            ⚠️ <strong>Важливо:</strong> для хутрових порід (рекс, ангора,
            шиншила) розподіл балів суттєво відрізняється — хутро може займати
            до 40–50 балів. Завжди перевіряйте стандарт конкретної породи, а не
            загальну таблицю.
          </p>
        </div>

        {/* ВІКОВІ КЛАСИ */}
        <h2 className="ss-section-title">Вікові класи учасників</h2>
        <div className="ss-classes-grid">
          {exhibitionClasses.map((cls) => (
            <div key={cls.id} className="ss-class-card">
              <h3 className="ss-class-name">{cls.name}</h3>
              <div className="ss-class-rows">
                <div className="ss-class-row">
                  <span className="ss-class-label">📅 Вік</span>
                  <p>{cls.ageRange}</p>
                </div>
                <div className="ss-class-row">
                  <span className="ss-class-label">⚖️ Вага</span>
                  <p>{cls.weightNote}</p>
                </div>
                <div className="ss-class-row">
                  <span className="ss-class-label">📝 Особливості</span>
                  <p>{cls.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ПРОЦЕС ОЦІНЮВАННЯ */}
        <h2 className="ss-section-title">Процес оцінювання — крок за кроком</h2>
        <p className="ss-intro">
          Що робить суддя від першого погляду до виставлення балів
        </p>
        <div className="ss-judge-steps">
          {judgeProcess.map((step) => {
            const isOpen = openJudge === step.step;
            return (
              <div
                key={step.step}
                className={`ss-judge-step ${isOpen ? "ss-judge-step--open" : ""}`}
                onClick={() => setOpenJudge(isOpen ? null : step.step)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenJudge(isOpen ? null : step.step)
                }
              >
                <div className="ss-judge-header">
                  <div className="ss-judge-num">{step.step}</div>
                  <span className="ss-judge-icon">{step.icon}</span>
                  <strong className="ss-judge-action">{step.action}</strong>
                  <span className="ss-judge-time">{step.duration}</span>
                  <span className="ss-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && <p className="ss-judge-detail">{step.detail}</p>}
              </div>
            );
          })}
        </div>

        {/* НАГОРОДИ */}
        <h2 className="ss-section-title">Нагороди та оцінки</h2>
        <p className="ss-intro">Натисніть — детальний опис кожного рівня</p>
        <div className="ss-awards-list">
          {awardLevels.map((award, i) => {
            const isOpen = openAward === i;
            return (
              <div
                key={i}
                className={`ss-award-card ${isOpen ? "ss-award-card--open" : ""}`}
                style={{
                  borderColor: award.color + "44",
                  background: isOpen ? award.bg : "var(--cream)",
                }}
                onClick={() => setOpenAward(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenAward(isOpen ? null : i)
                }
              >
                <div className="ss-award-header">
                  <span
                    className="ss-award-rank"
                    style={{ color: award.color }}
                  >
                    #{award.rank}
                  </span>
                  <div className="ss-award-titles">
                    <strong
                      className="ss-award-title"
                      style={{ color: award.color }}
                    >
                      {award.title}
                    </strong>
                    <span className="ss-award-ukr">{award.titleUkr}</span>
                  </div>
                  {award.minScore > 0 && (
                    <span
                      className="ss-award-score"
                      style={{ color: award.color, background: award.bg }}
                    >
                      {award.minScore}+ балів
                    </span>
                  )}
                  <span className="ss-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && <p className="ss-award-desc">{award.description}</p>}
              </div>
            );
          })}
        </div>

        {/* СУДДІВСЬКА КАРТКА */}
        <h2 className="ss-section-title">
          Суддівська картка — поля та приклад
        </h2>
        <p className="ss-intro">
          Що містить офіційна картка після оцінювання і що з нею робити
        </p>
        <div className="ss-table-wrap">
          <table className="ss-table">
            <thead>
              <tr>
                <th>Поле картки</th>
                <th>Приклад заповнення</th>
              </tr>
            </thead>
            <tbody>
              {expertCardFields.map((f, i) => (
                <tr key={i}>
                  <td>
                    <strong>{f.field}</strong>
                  </td>
                  <td className="ss-td-example">{f.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ss-note">
          <p>
            💡 <strong>Порада:</strong> Зберігайте суддівські картки всіх своїх
            тварин. Коментарі різних суддів дають об'єктивну картину сильних і
            слабких сторін вашого поголів'я. Порівняйте картки одного і того ж
            тваринного через рік — видно прогрес у розведенні.
          </p>
        </div>

        {/* ТИПОВІ ПОМИЛКИ */}
        <h2 className="ss-section-title">Типові помилки учасників</h2>
        <p className="ss-intro">Натисніть — наслідок та як уникнути</p>
        <div className="ss-mistakes-list">
          {commonMistakes.map((m, i) => {
            const isOpen = openMistake === i;
            return (
              <div
                key={i}
                className={`ss-mistake-card ${isOpen ? "ss-mistake-card--open" : ""}`}
                onClick={() => setOpenMistake(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenMistake(isOpen ? null : i)
                }
              >
                <div className="ss-mistake-header">
                  <span className="ss-mistake-num">{i + 1}</span>
                  <strong className="ss-mistake-name">{m.mistake}</strong>
                  <span className="ss-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="ss-mistake-details">
                    <div className="ss-mistake-block ss-mistake-block--bad">
                      <span className="ss-mistake-label">❌ Наслідок</span>
                      <p>{m.consequence}</p>
                    </div>
                    <div className="ss-mistake-block ss-mistake-block--good">
                      <span className="ss-mistake-label">✅ Як уникнути</span>
                      <p>{m.prevention}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ПІДГОТОВКА ЧЕКЛИСТ */}
        <h2 className="ss-section-title">Чеклист підготовки до виставки</h2>
        <div className="ss-checklist-grid">
          {[
            {
              period: "За місяць",
              items: [
                "Перевірити відповідність вікової категорії на день шоу",
                "Переконатись що тварина не буде в лінці",
                "Перевірити та оновити документи (родовід, ветпаспорт)",
                "Зареєструватись та сплатити внесок",
              ],
            },
            {
              period: "За тиждень",
              items: [
                "Підстригти кігті (не пізніше!)",
                "Перевірити вуха — очистити при потребі",
                "Оцінити хутро — вичесати якщо потрібно",
                "Зважити — перевірити відповідність стандарту",
              ],
            },
            {
              period: "За день",
              items: [
                "Підготувати переноску з підстилкою зі знайомим запахом",
                "Зібрати документи: родовід, ветпаспорт, реєстраційна картка",
                "Перевірити воду та невелику кількість корму в дорогу",
                "Не мити тварину — лише злегка вичесати при потребі",
              ],
            },
            {
              period: "День шоу",
              items: [
                "Приїхати мінімум за 2–3 год до оцінювання",
                "Дати тварині воду та час заспокоїтись",
                "Не годувати рясно за 3–4 год до виходу на стіл",
                "Ознайомитись з розкладом та черговістю порід",
              ],
            },
          ].map((block, i) => (
            <div key={i} className="ss-checklist-card">
              <h3 className="ss-checklist-title">{block.period}</h3>
              <ul className="ss-checklist-list">
                {block.items.map((item, j) => (
                  <li key={j} className="ss-checklist-item">
                    <span className="ss-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* АЛЕРТИ */}
        <h2 className="ss-section-title">Важливо знати</h2>
        <div className="ss-alert danger">
          🚨 Тварина з ознаками хвороби (кірки у вухах, виділення з носа/очей,
          кульгавість) знімається з виставки — це правило всіх організацій без
          винятків
        </div>
        <div className="ss-alert danger">
          🚨 Підроблення документів або заміна тварини після реєстрації —
          пожиттєва дискваліфікація власника
        </div>
        <div className="ss-alert warn">
          ⚠️ Рішення судді є остаточним. Суперечки щодо оцінки можливі тільки
          при явній технічній помилці (неправильно зарахована порода або клас)
        </div>
        <div className="ss-alert warn">
          ⚠️ Оцінка залежить від конкретного судді — один і той самий кролик
          може отримати різні бали на різних виставках
        </div>
        <div className="ss-alert ok">
          ✓ Суддівська картка з коментарями — безцінний інструмент для
          покращення стада. Читайте уважно навіть при відмінній оцінці
        </div>

        <div className="ss-note" style={{ marginTop: "1.5rem" }}>
          <p>
            <strong>Джерела:</strong> ARBA — Standard of Perfection & Show Rules
            (2021–2025); BRC — Show Regulations and Judging Guidelines; ZDRK —
            Bewertungsrichtlinien und Ausstellungsordnung; Sandford J.C. — The
            Domestic Rabbit (5th ed., Blackwell Science); Bennett B. — Storey's
            Guide to Raising Rabbits (4th ed.).
          </p>
        </div>
      </div>

      <div className="ss-related">
        <h3 className="ss-related-title">Читайте також</h3>
        <div className="ss-related-grid">
          <Link to="/show-judging" className="ss-related-link">
            👨‍⚖️ Суддівство на виставках
          </Link>
          <Link to="/breed-standards" className="ss-related-link">
            📜 Стандарти порід
          </Link>
          <Link to="/disqualifying-faults" className="ss-related-link">
            ❌ Дискваліфікаційні вади
          </Link>
          <Link to="/rabbit-conformation" className="ss-related-link">
            🐇 Екстер'єр кроля
          </Link>
          <Link to="/show-preparation" className="ss-related-link">
            🏆 Підготовка до виставки
          </Link>
        </div>
      </div>

      <div className="ss-back">
        <Link to="/" className="ss-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
