import { useState } from "react";
import { Link } from "react-router-dom";
import "./LitterTraining.css";

interface Step {
  step: string;
  title: string;
  text: string;
}

interface Mistake {
  claim: string;
  truth: string;
}

const steps: Step[] = [
  {
    step: "01",
    title: "Чому це працює",
    text: "Кролики від природи обирають один-два кутки для туалету і повертаються туди знову. Привчання до лотка спирається саме на цю звичку, а не на дресирування — тварину не вчать новому, а лише допомагають визначитись із місцем.",
  },
  {
    step: "02",
    title: "Де поставити лоток",
    text: "Спостерігайте перший день-два: кролик сам покаже кут, який обирає найчастіше. Лоток ставлять саме туди, а не там, де зручніше господарю — спроба нав'язати інше місце майже завжди провалюється.",
  },
  {
    step: "03",
    title: "Сіно над лотком",
    text: "Кролики їдять і одночасно спорожнюються, тож сінник над лотком або збоку від нього закріплює звичку набагато швидше, ніж будь-яке заохочення ласощами.",
  },
  {
    step: "04",
    title: "Вибір наповнювача",
    text: "Безпечні варіанти — пресовані деревні гранули без ароматизаторів або паперовий наповнювач. Комкового наповнювача на основі глини та силікагелю варто уникати: за випадкового поїдання він набрякає в кишківнику.",
  },
  {
    step: "05",
    title: "Скільки лотків потрібно",
    text: "Орієнтир — один лоток на кожен кут чи поверх, де буває кролик, плюс один додатковий. Що менше кроку до найближчого лотка, то менше шансів на випадковість повз нього.",
  },
  {
    step: "06",
    title: "Стерилізація і поведінка",
    text: "Гормони — головна причина, чому статево зрілий кролик мітить територію попри лоток. Стерилізація чи кастрація у більшості випадків суттєво знижує мітки протягом кількох тижнів після операції.",
  },
  {
    step: "07",
    title: "Коли звичка повертається",
    text: "Переїзд, новий кролик у домі, перестановка меблів чи хвороба можуть тимчасово повернути мітки навіть у добре привченої тварини. Це не 'зіпсований' кролик, а реакція на зміну — лоток просто повертають на звичне місце і дають час.",
  },
];

const mistakes: Mistake[] = [
  {
    claim: "Кролик мститься, коли мітить лоток",
    truth:
      "Кролики не пов'язують сечу з помстою чи образою — мітка це територіальний сигнал, гормональний або стресовий, а не емоційна відповідь на господаря.",
  },
  {
    claim: "Треба відразу карати за випадок повз лоток",
    truth:
      "Покарання лише підвищує стрес і може погіршити ситуацію. Дієвіше — прибрати запах звичайним засобом і повернути лоток туди, де кролик найчастіше буває.",
  },
  {
    claim: "Дорослого кролика вже не перевчити",
    truth:
      "Дорослі кролики привчаються так само добре, як молоді, а часом і краще — особливо після стерилізації чи кастрації.",
  },
  {
    claim: "Кілька крапель мітки і повний випадок — одне й те саме",
    truth:
      "Невелика кількість сечі в новому місці — це мітка, сигнал статусу чи території. Регулярне спорожнення повз лоток частіше вказує на незручне розташування лотка або стрес.",
  },
];

export default function LitterTraining() {
  const [openMistake, setOpenMistake] = useState<number | null>(0);

  return (
    <div className="lt-page">
      <header className="lt-hero">
        <span className="lt-eyebrow">Гігієна та звички</span>
        <h1 className="lt-title">
          Привчання до лотка
          <span className="lt-title-accent">від А до Я</span>
        </h1>
        <p className="lt-lede">
          Техніка, вибір наповнювача та причини, чому кролик іноді мітить попри
          привчання. Просте пояснення без карання й здогадок.
        </p>
      </header>

      <main className="lt-warren" aria-label="Кроки привчання">
        <div className="lt-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="lt-chamber" key={s.step}>
            <div className="lt-chamber-marker">
              <span className="lt-chamber-step">{s.step}</span>
            </div>
            <div className="lt-chamber-body">
              <h2 className="lt-chamber-title">{s.title}</h2>
              <p className="lt-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="lt-mistakes" aria-label="Поширені помилки та міфи">
        <h2 className="lt-section-heading">Помилки та міфи</h2>
        <div className="lt-mistake-list">
          {mistakes.map((m, i) => {
            const isOpen = openMistake === i;
            return (
              <div
                className={`lt-mistake${isOpen ? " lt-mistake--open" : ""}`}
                key={m.claim}
              >
                <button
                  className="lt-mistake-trigger"
                  onClick={() => setOpenMistake(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{m.claim}</span>
                  <span className="lt-mistake-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="lt-mistake-truth">{m.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="lt-note" aria-label="Порада щодо запаху">
        <p>
          Для прибирання після випадку повз лоток краще уникати засобів на
          основі аміаку — його запах нагадує сечу і провокує повторні мітки на
          тому ж місці. Підійде розчин оцту або спеціальний засіб для видалення
          запахів тварин.
        </p>
      </section>

      <div className="lt-related">
        <h3 className="lt-related-title">Читайте також</h3>
        <div className="lt-related-grid">
          <Link to="/apartment-proofing" className="lt-related-link">
            🛋️ Кролик-пруфінг квартири
          </Link>
          <Link to="/enrichment" className="lt-related-link">
            🧸 Збагачення середовища
          </Link>
          <Link to="/neutering" className="lt-related-link">
            ⚕️ Кастрація та стерилізація
          </Link>
          <Link to="/rabbit-stress" className="lt-related-link">
            ⚡ Стрес та переляк
          </Link>
        </div>
      </div>

      <footer className="lt-footer">
        <p>
          Матеріал підготовлено на основі загальноприйнятих рекомендацій щодо
          поведінки та утримання домашніх кролів. Якщо мітки з'явилися раптово в
          дорослого привченого кролика, варто виключити захворювання
          сечовивідної системи у ветеринара.
        </p>
      </footer>
    </div>
  );
}
