import { useState } from "react";
import { Link } from "react-router-dom";
import "./RabbitAllergy.css";

interface Source {
  icon: string;
  title: string;
  text: string;
}

interface Step {
  step: string;
  title: string;
  text: string;
}

interface Myth {
  claim: string;
  truth: string;
}

const sources: Source[] = [
  {
    icon: "💧",
    title: "Слина",
    text: "Найпотужніше джерело алергенів у кролика — саме слина, а не шерсть, як часто думають. Алерген потрапляє на шерсть під час вилизування і далі поширюється по всій оселі.",
  },
  {
    icon: "🚰",
    title: "Сеча",
    text: "Другий значний за силою екстракт. Алерген присутній у невеликій частці від загального білка сечі, але цього достатньо для реакції в чутливих людей, особливо під час прибирання клітки.",
  },
  {
    icon: "🧶",
    title: "Шерсть і лупа",
    text: "Дрібні частинки лупи розлітаються по кімнаті й осідають у пилу навіть без прямого контакту з твариною — тому симптоми можуть з'являтися і тоді, коли самого кролика поруч немає.",
  },
];

const steps: Step[] = [
  {
    step: "01",
    title: "Підтвердити діагноз в алерголога",
    text: "Нежить чи сльозогінність після контакту з кроликом не завжди означає алергію саме на нього — шкірна проба чи аналіз крові на специфічний IgE відрізняють це від звичайної застуди чи алергії на пилок сіна поруч із твариною.",
  },
  {
    step: "02",
    title: "Обмежити зону поширення алергену",
    text: "Кролика тримають поза спальнею, а HEPA-фільтр у кімнаті знижує кількість алергену в повітрі. Регулярне вологе прибирання зменшує накопичення в пилу значно ефективніше за сухе.",
  },
  {
    step: "03",
    title: "Мити руки й одяг одразу після контакту",
    text: "Алерген легко переноситься на одяг і звідти — на обличчя чи інші поверхні. Проста звичка мити руки й перевдягатися після тривалого контакту суттєво знижує випадкове перенесення.",
  },
  {
    step: "04",
    title: "Розділити обов'язки по догляду",
    text: "Прибирання клітки й лотка — момент найбільшого контакту з алергеном із сечі. Якщо в родині є людина без алергії, логічно саме їй узяти на себе цю частину догляду.",
  },
  {
    step: "05",
    title: "Обговорити медикаментозний контроль",
    text: "Антигістамінні препарати чи назальні спреї, підібрані лікарем, здатні суттєво полегшити симптоми при збереженні контакту з твариною — рішення про подальше утримання кролика приймають разом із алергологом, а не навмання.",
  },
];

const myths: Myth[] = [
  {
    claim:
      "Алергія на кролів — це те саме, що алергія на шерсть тварин загалом",
    truth:
      "Алергени кролика — специфічні білки в слині, сечі та шерсті, відмінні від котячих чи собачих, хоча один із них структурно схожий на головний алерген кота. Реакція на одну тварину не гарантує й не виключає реакцію на іншу.",
  },
  {
    claim:
      "Якщо симптомів не було одразу після появи кролика, алергії не буде ніколи",
    truth:
      "Сенсибілізація здатна розвинутися після місяців чи навіть років регулярного контакту. Відсутність реакції на початку не є гарантією на майбутнє.",
  },
  {
    claim: "Купання кролика вирішує проблему алергії",
    truth:
      "Кролів у принципі не рекомендують купати без крайньої потреби — це стрес і ризик переохолодження. До того ж алерген присутній не лише на шерсті, а й у слині та сечі, тож миття тварини не усуває джерело проблеми.",
  },
  {
    claim: "Існують гіпоалергенні породи кролів",
    truth:
      "Алергенні білки виробляються незалежно від породи чи довжини шерсті. Коротка шерсть може означати менше видимого линяння, але не менший вміст алергену в слині чи сечі.",
  },
];

export default function RabbitAllergy() {
  const [openMyth, setOpenMyth] = useState<number | null>(0);

  return (
    <div className="ra-page">
      <header className="ra-hero">
        <h1 className="ra-title">
          Алергія на кролів у людей
          <span className="ra-title-accent">що варто знати перед покупкою</span>
        </h1>
        <p className="ra-lede">
          Алергія на кролів трапляється рідше, ніж на котів чи собак, але може
          виникнути навіть у людини, яка ніколи раніше не мала алергій на
          тварин. Джерело — не тільки шерсть, а насамперед слина й сеча.
        </p>
      </header>

      <section className="ra-sources" aria-label="Звідки походить алерген">
        <h2 className="ra-section-heading">Звідки походить алерген</h2>
        <div className="ra-source-grid">
          {sources.map((s) => (
            <article className="ra-source-card" key={s.title}>
              <span className="ra-source-icon" aria-hidden="true">
                {s.icon}
              </span>
              <h3 className="ra-source-title">{s.title}</h3>
              <p className="ra-source-text">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ra-symptoms" aria-label="Симптоми">
        <h2 className="ra-section-heading">Як це проявляється</h2>
        <div className="ra-symptom-grid">
          <div className="ra-symptom-card">
            <span className="ra-symptom-label">Легкі симптоми</span>
            <p>
              Чхання, закладеність носу, свербіж і сльозогінність очей, кашель.
            </p>
          </div>
          <div className="ra-symptom-card ra-symptom-card--severe">
            <span className="ra-symptom-label">Виражені симптоми</span>
            <p>
              Висип чи кропив'янка на шкірі, свистяче дихання, задишка — у
              рідкісних випадках можлива важка реакція, що вимагає негайної
              медичної допомоги.
            </p>
          </div>
        </div>
      </section>

      <main className="ra-warren" aria-label="Що робити далі">
        <h2 className="ra-section-heading">Що робити далі</h2>
        <div className="ra-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="ra-chamber" key={s.step}>
            <div className="ra-chamber-marker">
              <span className="ra-chamber-step">{s.step}</span>
            </div>
            <div className="ra-chamber-body">
              <h3 className="ra-chamber-title">{s.title}</h3>
              <p className="ra-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="ra-myths" aria-label="Поширені хибні уявлення">
        <h2 className="ra-section-heading">Поширені хибні уявлення</h2>
        <div className="ra-myth-list">
          {myths.map((m, i) => {
            const isOpen = openMyth === i;
            return (
              <div
                className={`ra-myth${isOpen ? " ra-myth--open" : ""}`}
                key={m.claim}
              >
                <button
                  className="ra-myth-trigger"
                  onClick={() => setOpenMyth(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{m.claim}</span>
                  <span className="ra-myth-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="ra-myth-truth">{m.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="ra-related">
        <h3 className="ra-related-title">Читайте також</h3>
        <div className="ra-related-grid">
          <Link to="/zoonoses" className="ra-related-link">
            🦠 Зоонози
          </Link>
          <Link to="/buying-rabbit" className="ra-related-link">
            🐇 Купівля кроля
          </Link>
          <Link to="/rabbit-myths" className="ra-related-link">
            🚫 Міфи про кролів
          </Link>
          <Link to="/care" className="ra-related-link">
            🧹 Догляд
          </Link>
        </div>
      </div>

      <footer className="ra-footer">
        <p>
          Матеріал підготовлено на основі алергологічних джерел і не є медичною
          консультацією. Підтвердження діагнозу та підбір лікування — виключно в
          лікаря-алерголога, особливо перш ніж приймати рішення про подальше
          утримання тварини в родині.
        </p>
      </footer>
    </div>
  );
}
