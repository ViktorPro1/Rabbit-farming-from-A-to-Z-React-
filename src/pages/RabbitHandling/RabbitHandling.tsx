import { Link } from "react-router-dom";
import "./RabbitHandling.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const dos = [
  {
    icon: "🐇",
    name: "Підходьте спокійно, знизу",
    desc: "Не зверху — різкий рух зверху сприймається як атака хижака.",
  },
  {
    icon: "🤲",
    name: "Одна рука під груди",
    desc: "Одразу за передніми лапками.",
  },
  {
    icon: "✋",
    name: "Друга рука під задню частину",
    desc: "Повністю, щоб задні лапи мали опору й не звисали вільно.",
  },
  {
    icon: "🫂",
    name: "Притискайте до тіла",
    desc: "Близький контакт заспокоює й рівномірно розподіляє вагу.",
  },
];

const donts = [
  "Ніколи не піднімайте кроля за вуха",
  "Ніколи не тримайте лише за холку без підтримки тіла",
  "Ніколи не дозволяйте заднім лапам вільно звисати",
  "Не тримайте як немовля (на спині) без надійної фіксації",
  "Не утримуйте силою тварину, що відчайдушно виривається",
];

const RabbitHandling = () => {
  return (
    <main className="handling-page">
      <div className="handling-header">
        <h1>🤲 Правильне утримання кроля на руках</h1>
        <p>
          Найпоширеніша помилка новачків — і головна причина переломів хребта
        </p>
      </div>

      <div className="handling-wrap">
        <div className="handling-intro">
          <h2>Чому кролі так вразливі</h2>
          <p>
            Скелет кроля становить лише близько 8% від маси тіла (у кота —
            приблизно 13%), тоді як задні лапи мають дуже потужну мускулатуру.
            Якщо задня частина тіла не підтримана, один різкий ривок чи удар
            лапами може зламати хребет.
          </p>
          <div className="handling-alert danger">
            🔴 Перелом хребта у кроля майже завжди означає параліч і, як
            наслідок, евтаназію. Кролик — здобич, а не хижак: підняття без
            надійної опори викликає паніку й відчайдушну боротьбу, яка й ламає
            крихкий хребет.
          </div>
        </div>

        <div className="handling-section-title">✅ Як правильно піднімати</div>
        <div className="handling-causes-grid">
          {dos.map((d) => (
            <article key={d.name} className="handling-cause-card">
              <div className="handling-cause-header">
                <span className="handling-cause-icon">{d.icon}</span>
                <h2>{d.name}</h2>
              </div>
              <p className="handling-cause-desc">{d.desc}</p>
            </article>
          ))}
        </div>

        <div className="handling-section-title">🚫 Чого робити не можна</div>
        <div className="handling-note">
          <ul>
            {donts.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>

        <div className="handling-section-title">😰 Якщо кролик панікує</div>
        <div className="handling-note">
          <p>
            Найбезпечніше — плавно опустити тварину на стійку поверхню й
            відпустити, а не утримувати силою. М'який голос і накриття очей
            рукою чи рушником часто допомагають заспокоїтись.
          </p>
          <p>
            Для процедур, що вимагають фіксації, ветеринари використовують
            техніку "бурітто" — загортання в рушник. Детальніше — у статті
            "Таблетки та суспензії".
          </p>
        </div>

        <div className="handling-section-title">
          ⚠️ Додаткові фактори ризику
        </div>
        <div className="handling-facts-grid">
          <div className="handling-fact-card warn">
            <h3>⚠️ Довгі кігті на задніх лапах</h3>
            <p>
              Можуть чіплятись за килим, спричиняючи перерозгинання суглоба під
              час стрибка.
            </p>
          </div>
          <div className="handling-fact-card warn">
            <h3>⚠️ Слизька підлога</h3>
            <p>Ламінат чи кахель підвищують ризик падінь.</p>
          </div>
          <div className="handling-fact-card warn">
            <h3>⚠️ Високі меблі</h3>
            <p>Не залишайте кроля без нагляду на піднятій поверхні.</p>
          </div>
        </div>

        <div className="handling-note handling-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Rabbit Welfare Association & Fund (RWAF) — Handling Rabbits</li>
            <li>Lafeber Co. — The Proper Way To Handle A Pet Rabbit</li>
            <li>dvm360 — Preventing injury in rabbits with proper restraint</li>
            <li>Winter Park Veterinary Hospital — Rabbit Handling</li>
          </ul>
          <p className="handling-disclaimer">
            При підозрі на травму хребта негайно зверніться до ветеринара — не
            перевіряйте рухливість самостійно.
          </p>
        </div>

        <div className="handling-related">
          <h3 className="handling-related-title">Читайте також</h3>
          <div className="handling-related-grid">
            <Link to="/buying-rabbit" className="handling-related-link">
              🐇 Купівля кроля
            </Link>
            <Link to="/grooming" className="handling-related-link">
              ✂️ Кігті та зуби
            </Link>
            <Link to="/vet-oral-meds" className="handling-related-link">
              💊 Таблетки та суспензії
            </Link>
          </div>
        </div>

        <div className="handling-back">
          <Link to="/" className="handling-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Правильне утримання кроля на руках" />
        </div>
      </div>
    </main>
  );
};

export default RabbitHandling;
