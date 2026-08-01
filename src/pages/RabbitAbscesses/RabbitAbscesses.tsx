import { Link } from "react-router-dom";
import "./RabbitAbscesses.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const causes = [
  {
    icon: "🦷",
    name: "Стоматологічні (одонтогенні)",
    desc: "Найчастіша причина. Зуби ростуть все життя — при неправильному стиранні чи оголенні кореня інфекція проникає в кістку щелепи.",
    facts: [
      "Найпоширеніша причина абсцесів у кролів взагалі",
      "Середній вік прояву за клінічними даними — близько 4 років",
      "Самці уражаються дещо частіше за самок",
      "Часто уражає одразу кілька коренів зубів",
      "Може проявлятись припухлістю на щоці, під щелепою або навіть за оком",
    ],
  },
  {
    icon: "🥊",
    name: "Укуси та бійки",
    desc: "Особливо у самців, яких тримають разом і які конкурують за територію чи самку.",
    facts: [
      "Найчастіше на морді, вухах, крупі",
      "Ризик зростає в період статевої активності",
      "Профілактика: розсаджувати конкуруючих самців",
    ],
  },
  {
    icon: "🩹",
    name: "Рани та подряпини",
    desc: "Інфікуються через несвоєчасну обробку — від гострих країв клітки, сітки, гвіздків.",
    facts: [
      "Будь-яка відкрита рана — вхідні ворота для бактерій",
      "Обробляти одразу після виявлення",
    ],
  },
  {
    icon: "🦶",
    name: "На лапах",
    desc: "Часто пов'язані з пододерматитом — постійним тиском на підошву на твердій підлозі.",
    facts: [
      "Дивись також статтю про пододерматит",
      "У важких випадках може знадобитись ампутація лапи",
    ],
  },
  {
    icon: "👁️",
    name: "Очні та навколоносові",
    desc: "Часто вторинні до стоматологічної проблеми чи нелікованого нежитю.",
    facts: [
      "Найскладніша локалізація для хірургічного доступу",
      "Прогноз обережніший, ніж при абсцесі щоки чи щелепи",
    ],
  },
];

const symptoms = [
  { sign: "Щільна припухлість під шкірою", note: "Часто болюча на дотик" },
  {
    sign: "Місцеве підвищення температури шкіри",
    note: "Над самою припухлістю",
  },
  {
    sign: "Зниження апетиту аж до повної відмови",
    note: "Особливо при стоматологічній причині",
  },
  { sign: "Підвищене слиновиділення", note: "Типово для проблем із зубами" },
  { sign: "Сльозотеча (епіфора)", note: "Сигнал ураження верхніх зубів" },
  { sign: "Втрата ваги", note: "Через зниження апетиту" },
  {
    sign: "Густі білі чи жовтуваті виділення",
    note: "Якщо абсцес прорвався сам",
  },
  {
    sign: "Зменшення кількості посліду",
    note: "Тривожний сигнал початку ШКТ-стазу",
  },
];

const treatmentTechniques = [
  {
    title: "Марсупіалізація (відкрите загоєння)",
    tag: "Найвища ефективність",
    tagType: "ok",
    desc: "Повне видалення капсули, ураженого зуба й некротичної кістки. Рана свідомо не зашивається — краї підшиваються до шкіри, щоб порожнина лишалась відкритою.",
    points: [
      "Власник промиває порожнину антисептиком щодня 1–2 тижні",
      "Ветеринарний контроль щотижня до повного загоєння",
      "Загоєння вторинним натягом — зазвичай 6–8 тижнів",
      "Найнижчий задокументований ризик рецидиву",
    ],
  },
  {
    title: "Пакування рани (wound packing)",
    tag: "Порівнянна ефективність",
    tagType: "warn",
    desc: "Порожнину заповнюють стерильним матеріалом з антибіотиком, шкіру частково зашивають.",
    points: [
      "Не потребує щоденного промивання власником",
      "Успішність за окремими звітами близько 90%",
      "Вищий ризик ускладнень через повторні наркози для заміни пакування",
      "Складніший контроль — тварина може передчасно видалити пакування",
    ],
  },
];

const RabbitAbscesses = () => {
  return (
    <main className="abscess-page">
      <div className="abscess-header">
        <h1>🩹 Абсцеси у кролів</h1>
        <p>
          Чому "проколоти й видавити" тут не працює — і як влаштоване сучасне
          хірургічне лікування
        </p>
      </div>

      <div className="abscess-wrap">
        <div className="abscess-intro">
          <h2>Чому абсцеси у кролів особливі</h2>
          <p>
            Коли в тканину потрапляє інфекція, імунна система кроля формує
            навколо вогнища щільну фіброзну капсулу. Всередині накопичується
            густий гнійний вміст — консистенції пасти чи домашнього сиру. На
            відміну від котів чи собак, у кролів гній не розріджується
            достатньо, щоб вийти сам через розріз чи звичайний дренаж.
          </p>
          <p>
            Тому ветеринари підходять до абсцесу кроля так само, як до пухлини:
            найкращий результат дає повне видалення вогнища разом із капсулою
            одним блоком.
          </p>
          <div className="abscess-alert danger">
            🔴 Якщо капсулу просто розкрити, вичистити й зашити рану наглухо без
            видалення — абсцес майже напевно повернеться. У задокументованих
            дослідженнях після агресивного хірургічного підходу з повним
            видаленням рецидив трапляється приблизно у 8–10% випадків; при
            поверхневому розкритті — значно частіше.
          </div>
        </div>

        <div className="abscess-section-title">🔍 Найчастіші причини</div>
        <div className="abscess-causes-grid">
          {causes.map((c) => (
            <article key={c.name} className="abscess-cause-card">
              <div className="abscess-cause-header">
                <span className="abscess-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="abscess-cause-desc">{c.desc}</p>
              <ul className="abscess-cause-facts">
                {c.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="abscess-section-title">🌡️ Симптоми</div>
        <div className="abscess-table-wrap">
          <table className="abscess-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.map((s) => (
                <tr key={s.sign}>
                  <td>
                    <strong>{s.sign}</strong>
                  </td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="abscess-alert warn">
          ⚠️ Стоматологічний абсцес іноді проявляється не в роті, а як
          припухлість збоку морди чи навіть як витрішкуватість ока — тому
          будь-яку незрозумілу припухлість на голові варто перевіряти разом з
          детальним оглядом зубів.
        </div>

        <div className="abscess-section-title">🧪 Діагностика</div>
        <div className="abscess-note">
          <p>
            Ветеринар спершу підтверджує пункцією тонкою голкою, що це справді
            абсцес, а не кіста чи пухлина. Далі шукають причину:
          </p>
          <ul>
            <li>Огляд ротової порожнини на аномалії коронок зубів</li>
            <li>
              Рентген — базовий метод, дає загальне уявлення про стан зубів і
              кістки
            </li>
            <li>
              КТ голови — значно точніше показує межі остеомієліту й обсяг
              ураження, стандарт перед серйозною операцією в спеціалізованих
              клініках
            </li>
            <li>
              Бактеріологічний посів на чутливість до антибіотиків — збудники
              часто анаеробні
            </li>
          </ul>
        </div>

        <div className="abscess-section-title">🔪 Хірургічне лікування</div>
        <div className="abscess-treatment-grid">
          {treatmentTechniques.map((t) => (
            <div key={t.title} className="abscess-treatment-card">
              <div className="abscess-treatment-top">
                <h3>{t.title}</h3>
                <span className={`abscess-tag ${t.tagType}`}>{t.tag}</span>
              </div>
              <p>{t.desc}</p>
              <ul>
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="abscess-alert danger">
          🔴 Коли причина стоматологічна, лікування завжди включає видалення
          ураженого зуба разом з абсцесом — без цього рецидив майже
          гарантований.
        </div>

        <div className="abscess-section-title">📈 Прогноз</div>
        <div className="abscess-note">
          <p>
            Прогноз залежить від локалізації (щока/щелепа — сприятливіше, ніж
            абсцес за оком чи в носових пазухах), тривалості хвороби до
            звернення й кількості уражених зубів. Контрольний огляд зазвичай
            призначають через 6–8 тижнів після завершення лікування.
          </p>
        </div>

        <div className="abscess-section-title">
          🏠 Догляд удома під час лікування
        </div>
        <div className="abscess-note">
          <ul>
            <li>
              Суворо дотримуйтесь графіка промивань, навіть якщо рана виглядає
              чистою
            </li>
            <li>
              М'яка їжа чи допоміжне годування, якщо кролик їсть погано через
              біль
            </li>
            <li>
              Знеболення на весь період загоєння — на постійній основі, а не "за
              потреби"
            </li>
            <li>
              Щодня перевіряйте наявність посліду — найпростіший домашній
              індикатор апетиту
            </li>
            <li>
              Не пропускайте контрольні огляди, навіть якщо рана виглядає
              загоєною
            </li>
          </ul>
        </div>

        <div className="abscess-section-title">🛡️ Профілактика</div>
        <div className="abscess-facts-grid">
          <div className="abscess-fact-card ok">
            <h3>✅ Сіно як основа раціону</h3>
            <p>
              Близько 80% раціону — сіно природно стирає зуби й знижує ризик
              стоматологічних абсцесів.
            </p>
          </div>
          <div className="abscess-fact-card ok">
            <h3>✅ Регулярні огляди зубів</h3>
            <p>
              Планові стоматологічні перевірки у ветеринара дозволяють помітити
              проблему до абсцесу.
            </p>
          </div>
          <div className="abscess-fact-card warn">
            <h3>⚠️ Контроль ваги</h3>
            <p>Ожиріння підвищує ризик абсцесів і ускладнює саму операцію.</p>
          </div>
          <div className="abscess-fact-card warn">
            <h3>⚠️ Розсаджування самців</h3>
            <p>
              Запобігайте скупченості й бійкам, особливо в період статевої
              активності.
            </p>
          </div>
        </div>

        <div className="abscess-section-title">❓ Часті запитання</div>
        <div className="abscess-note">
          <p>
            <strong>Чи можна лікувати абсцес самостійно вдома?</strong> Ні.
            Навіть якщо абсцес прорвався сам, капсула й, найімовірніше, уражений
            зуб залишаються джерелом інфекції.
          </p>
          <p>
            <strong>Чи потрібні повторні наркози?</strong> При марсупіалізації
            зазвичай ні — промивання виконує власник без седації. При пакуванні
            рани іноді потрібні короткі повторні наркози для заміни матеріалу.
          </p>
        </div>

        <div className="abscess-note abscess-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Diagnosis and outcome of odontogenic abscesses in client-owned
              rabbits: 72 cases (2011–2022), JAVMA, 2024
            </li>
            <li>
              Radical debridement guided by advanced imaging for odontogenic
              abscesses and jaw osteomyelitis in rabbits, JAVMA, 2023
            </li>
            <li>
              Clinician's Brief — How to Treat Periapical Mandibular Abscess in
              Rabbits
            </li>
            <li>
              dvm360 — Treatment of periapical abscesses and osteomyelitis in
              rabbits
            </li>
            <li>
              Merck (MSD) Veterinary Manual — Bacterial and Mycotic Diseases of
              Rabbits
            </li>
          </ul>
          <p className="abscess-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="abscess-related">
          <h3 className="abscess-related-title">Читайте також</h3>
          <div className="abscess-related-grid">
            <Link to="/diseases" className="abscess-related-link">
              🩺 Хвороби
            </Link>
            <Link to="/grooming" className="abscess-related-link">
              ✂️ Кігті та зуби
            </Link>
            <Link to="/pain-management" className="abscess-related-link">
              🩹 Знеболення
            </Link>
            <Link to="/symptoms" className="abscess-related-link">
              🌡️ Симптоматичний пошук
            </Link>
            <Link to="/anesthesia-care" className="abscess-related-link">
              💉 Анестезія та післяопераційний догляд
            </Link>
          </div>
        </div>

        <div className="abscess-back">
          <Link to="/" className="abscess-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Абсцеси у кролів" />
        </div>
      </div>
    </main>
  );
};

export default RabbitAbscesses;
