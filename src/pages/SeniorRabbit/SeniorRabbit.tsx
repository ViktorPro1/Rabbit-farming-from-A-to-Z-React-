import { useState } from "react";
import { Link } from "react-router-dom";
import "./SeniorRabbit.css";

interface Sign {
  icon: string;
  title: string;
  text: string;
}

interface Care {
  title: string;
  text: string;
}

interface Faq {
  claim: string;
  truth: string;
}

const signs: Sign[] = [
  {
    icon: "🦴",
    title: "Артрит і рухливість",
    text: "Кролик рідше застрибує на улюблені місця, повільніше піднімається, менше грумингується. Біль у суглобах часто підтримують знеболювальними препаратами під наглядом ветеринара — це не виліковує артрит, але суттєво повертає якість життя.",
  },
  {
    icon: "🦷",
    title: "Зубні проблеми",
    text: "Вибіркове харчування, слинотеча, зниження апетиту — типові ознаки. Оскільки зуби кролика ростуть постійно, проблема з часом лише наростає без втручання ветеринара.",
  },
  {
    icon: "💧",
    title: "Нирки та зневоднення",
    text: "Хронічне зневоднення — один із факторів, що навантажує нирки з віком. Постійний доступ до води й регулярні аналізи крові з 5 років допомагають виявити проблему раніше симптомів.",
  },
  {
    icon: "⚖️",
    title: "Зміна ваги",
    text: "Як втрата ваги, так і зайва вага в літньому віці — привід для огляду. Зайва вага додатково навантажує хворі суглоби, а раптове схуднення часто пов'язане із зубами чи внутрішніми органами.",
  },
  {
    icon: "👁️",
    title: "Зір і слух",
    text: "Кролик, що втрачає зір, орієнтується здебільшого на пам'ять простору і вуса. Тому меблі й розташування лотка, води та сіна краще не переставляти без потреби.",
  },
];

const careTips: Care[] = [
  {
    title: "Лоток з низьким входом",
    text: "Коли стрибати через високий бортик стає боляче, лоток із заниженим краєм чи саморобна рампа з рушника повертають кролику самостійність у туалеті.",
  },
  {
    title: "М'яка підстилка без слизьких підлог",
    text: "Дерево чи плитка вимагають напруження м'язів для стійкості — це виснажує кролика зі слабкими суглобами. Килимки чи мати на шляху до їжі, води й лотка дають опору лапам.",
  },
  {
    title: "Миска замість поїльниці-крапельниці",
    text: "Керамічна миска дозволяє пити в природнішій позі й підвищує споживання води — а достатня гідратація напряму знижує ризик застою кишківника і навантаження на нирки.",
  },
  {
    title: "Усе необхідне поруч",
    text: "Сіно, воду й лоток зручно зібрати ближче до улюбленого місця відпочинку кролика, щоб коротка відстань не забирала останні сили на прості речі.",
  },
  {
    title: "Частіші візити до ветеринара",
    text: "Після 5 років кролику радять оглядатися у ветеринара двічі на рік, з аналізом крові щонайменше раз на два роки — так вікові хвороби виявляють до появи явних симптомів.",
  },
];

const faqs: Faq[] = [
  {
    claim: "Кролик не показує біль — отже, йому не боляче",
    truth:
      "Кролик як здобич за природою приховує біль інстинктивно, щоб не виглядати вразливим. Відсутність явних скарг не означає відсутність болю — саме тому вікові огляди у ветеринара такі важливі.",
  },
  {
    claim: "Старість — природний процес, лікування не потрібне",
    truth:
      "Багато вікових станів, як-от біль від артриту, піддаються полегшенню знеболювальними чи зміною середовища. Природність віку не означає, що з дискомфортом нічого не можна зробити.",
  },
  {
    claim: "Евтаназія — це боляче для тварини",
    truth:
      "Процедура, яку проводить ветеринар, фізично безболісна: ін'єкція швидко й спокійно зупиняє дихання і серце протягом хвилини. Це складне рішення для господаря, але не болісний процес для кролика.",
  },
  {
    claim: "Бути поруч під час евтаназії — обов'язок господаря",
    truth:
      "Це особистий вибір, і жоден варіант не є правильним чи неправильним. Одним людям присутність допомагає прийняти втрату, іншим боляче спостерігати — кролик не оцінює це рішення.",
  },
];

export default function SeniorRabbit() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="sr-page">
      <header className="sr-hero">
        <span className="sr-eyebrow">Останній етап шляху</span>
        <h1 className="sr-title">
          Кролик похилого віку
          <span className="sr-title-accent">
            турбота, гідність, важкі рішення
          </span>
        </h1>
        <p className="sr-lede">
          За доброго догляду домашній кролик живе 8–12 років. Із віком
          з'являються нові потреби — і те, як ви на них відповісте, значно
          впливає на якість цих останніх років разом.
        </p>
      </header>

      <section className="sr-signs" aria-label="Ознаки старіння">
        <h2 className="sr-section-heading">На що звернути увагу</h2>
        <div className="sr-sign-grid">
          {signs.map((s) => (
            <article className="sr-sign-card" key={s.title}>
              <span className="sr-sign-icon" aria-hidden="true">
                {s.icon}
              </span>
              <h3 className="sr-sign-title">{s.title}</h3>
              <p className="sr-sign-text">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sr-care" aria-label="Що полегшує старість">
        <h2 className="sr-section-heading">Що реально допомагає</h2>
        <div className="sr-care-list">
          {careTips.map((c) => (
            <div className="sr-care-item" key={c.title}>
              <h3 className="sr-care-title">{c.title}</h3>
              <p className="sr-care-text">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sr-quality" aria-label="Оцінка якості життя">
        <h2 className="sr-section-heading">Три орієнтири якості життя</h2>
        <p className="sr-quality-intro">
          Ветеринари й притулки для кролів часто спираються на прості щоденні
          спостереження, а не лише на діагноз:
        </p>
        <div className="sr-quality-grid">
          <div className="sr-quality-card">
            <span className="sr-quality-label">Апетит</span>
            <p>Чи цікавиться кролик їжею й улюбленими ласощами, як раніше?</p>
          </div>
          <div className="sr-quality-card">
            <span className="sr-quality-label">Інтерес</span>
            <p>
              Чи спостерігає він за тим, що відбувається довкола, чи намагається
              доглядати за собою?
            </p>
          </div>
          <div className="sr-quality-card">
            <span className="sr-quality-label">Контакт</span>
            <p>Чи відгукується на дотик і присутність людини або пари?</p>
          </div>
        </div>
        <p className="sr-quality-note">
          Якщо відповідь переважно "так" у хороші дні, варто рахувати
          співвідношення хороших і важких днів — це рідко буває питанням одного
          моменту.
        </p>
      </section>

      <section className="sr-faq" aria-label="Поширені хибні уявлення">
        <h2 className="sr-section-heading">Те, що варто знати заздалегідь</h2>
        <div className="sr-faq-list">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                className={`sr-faq-item${isOpen ? " sr-faq-item--open" : ""}`}
                key={f.claim}
              >
                <button
                  className="sr-faq-trigger"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{f.claim}</span>
                  <span className="sr-faq-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="sr-faq-truth">{f.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="sr-note"
        aria-label="Про рішення разом із ветеринаром"
      >
        <p>
          Рішення про евтаназію ніколи не приймають наодинці з довідником — його
          приймають разом із ветеринаром, який знає вашого кролика і здатен
          об'єктивно оцінити біль, апетит і прогноз. Це глибоко особисте
          рішення, і не існує "правильного" моменту, підказаного ззовні.
        </p>
      </section>

      <div className="sr-related">
        <h3 className="sr-related-title">Читайте також</h3>
        <div className="sr-related-grid">
          <Link to="/pain-management" className="sr-related-link">
            🩹 Знеболення та аналгезія
          </Link>
          <Link to="/diseases" className="sr-related-link">
            🩺 Хвороби
          </Link>
          <Link to="/weight-control" className="sr-related-link">
            ⚖️ Контроль ваги
          </Link>
          <Link to="/companion-bonding" className="sr-related-link">
            👥 Один чи два кролики
          </Link>
        </div>
      </div>

      <footer className="sr-footer">
        <p>
          Матеріал підготовлено на основі рекомендацій House Rabbit Society,
          Rabbit Welfare Association &amp; Fund та ветеринарних джерел щодо
          догляду за кролями похилого віку. З питань здоров'я і рішень щодо
          якості життя конкретного кролика звертайтеся до ветеринара, що
          спеціалізується на екзотичних тваринах.
        </p>
      </footer>
    </div>
  );
}
