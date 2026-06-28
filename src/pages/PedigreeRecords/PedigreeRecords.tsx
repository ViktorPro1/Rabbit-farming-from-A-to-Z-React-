import { useState } from "react";
import "./PedigreeRecords.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

interface RecordField {
  field: string;
  description: string;
  required: boolean;
  example: string;
}

interface DocumentType {
  id: string;
  icon: string;
  name: string;
  purpose: string;
  contains: string[];
  when: string;
  note: string;
}

interface InbreedingLevel {
  coefficient: string;
  label: string;
  meaning: string;
  recommendation: string;
  color: string;
  bg: string;
}

interface LineDesc {
  term: string;
  definition: string;
  example: string;
  usage: string;
}

// ─── Data ────────────────────────────────────────────────────────
const animalCardFields: RecordField[] = [
  {
    field: "Кличка",
    description:
      "Унікальна в межах господарства. Традиційно — перша буква з кличок батьків",
    required: true,
    example: "Сніжок-14, Граніт-А",
  },
  {
    field: "Порода",
    description: "Повна назва породи відповідно до офіційного стандарту",
    required: true,
    example: "Новозеландський білий, Каліфорнійський",
  },
  {
    field: "Стать",
    description: "♂ самець або ♀ самка",
    required: true,
    example: "♂",
  },
  {
    field: "Дата народження",
    description: "Точна дата — визначає вік для виставки та розведення",
    required: true,
    example: "15.03.2025",
  },
  {
    field: "Номер маточника / кліщі",
    description: "Унікальний ідентифікатор — татуювання у вусі або мікрочіп",
    required: true,
    example: "ліве вухо: 25А14",
  },
  {
    field: "Батько (♂)",
    description: "Кличка, порода та номер батька",
    required: true,
    example: "Граніт, НЗБ, 24В07",
  },
  {
    field: "Мати (♀)",
    description: "Кличка, порода та номер матері",
    required: true,
    example: "Перлина, НЗБ, 24А03",
  },
  {
    field: "Дідусь по батькові",
    description: "Батько батька — для розрахунку ступеня спорідненості",
    required: false,
    example: "Арій, НЗБ, 23Г11",
  },
  {
    field: "Бабуся по батькові",
    description: "Мати батька",
    required: false,
    example: "Берест, НЗБ, 23Б05",
  },
  {
    field: "Дідусь по матері",
    description: "Батько матері",
    required: false,
    example: "Вулкан, НЗБ, 22В09",
  },
  {
    field: "Бабуся по матері",
    description: "Мати матері",
    required: false,
    example: "Зірка, НЗБ, 22А01",
  },
  {
    field: "Жива маса при народженні",
    description: "Вага при народженні або перша зафіксована",
    required: false,
    example: "55 г",
  },
  {
    field: "Жива маса в 30 днів",
    description: "Контрольне зважування при відлученні",
    required: false,
    example: "350 г",
  },
  {
    field: "Жива маса в 60 днів",
    description: "Контрольне зважування",
    required: false,
    example: "1050 г",
  },
  {
    field: "Жива маса в 90 днів",
    description: "Фінальне зважування перед забоєм або переводом у стадо",
    required: false,
    example: "2100 г",
  },
  {
    field: "Оцінка екстер'єру",
    description: "Бали на виставці або внутрішньогосподарська оцінка",
    required: false,
    example: "87/100, добре",
  },
  {
    field: "Вади та дефекти",
    description: "Всі виявлені відхилення від стандарту",
    required: false,
    example: "легка асиметрія вух",
  },
  {
    field: "Колір хутра та очей",
    description: "За стандартом породи",
    required: true,
    example: "Білий, очі рожеві (альбінос)",
  },
];

const matingRecordFields: RecordField[] = [
  {
    field: "Дата злучки",
    description: "Точна дата першої садки",
    required: true,
    example: "10.04.2025",
  },
  {
    field: "Самка (♀)",
    description: "Кличка та номер самки",
    required: true,
    example: "Перлина, 24А03",
  },
  {
    field: "Самець (♂)",
    description: "Кличка та номер плідника",
    required: true,
    example: "Граніт, 24В07",
  },
  {
    field: "Контрольна злучка",
    description: "Дата та результат повторної злучки через 12–14 год",
    required: true,
    example: "11.04.2025, підпустила",
  },
  {
    field: "Очікувана дата окролу",
    description: "Дата злучки + 31 день (середнє)",
    required: true,
    example: "11.05.2025",
  },
  {
    field: "Результат пальпації",
    description: "Дата та результат пальпації на 14–16 день",
    required: false,
    example: "24.04.2025, позитивна",
  },
  {
    field: "Фактична дата окролу",
    description: "Реальна дата народження потомства",
    required: true,
    example: "12.05.2025",
  },
  {
    field: "Кількість у посліді",
    description: "Загальна кількість народжених",
    required: true,
    example: "8 голів",
  },
  {
    field: "З них живих",
    description: "Живих при народженні",
    required: true,
    example: "7 голів",
  },
  {
    field: "З них мертвонароджених",
    description: "Мертвонароджені та нежиттєздатні",
    required: true,
    example: "1 голова",
  },
  {
    field: "Стать потомства",
    description: "Розподіл за статтю",
    required: false,
    example: "4 самці, 3 самки",
  },
  {
    field: "Коментар",
    description: "Особливості перебігу окролу, поведінка самки",
    required: false,
    example: "Нормальний окріл, самка годує добре",
  },
];

const documentTypes: DocumentType[] = [
  {
    id: "pedigree",
    icon: "📜",
    name: "Родовід (пedigree)",
    purpose: "Документ що підтверджує походження тварини протягом 3–5 поколінь",
    contains: [
      "Кличка та порода тварини",
      "Дата народження та стать",
      "Ідентифікаційний номер (татуювання/чіп)",
      "Батьки, дідусі/бабусі (мінімум 3 покоління)",
      "Оцінки екстер'єру предків",
      "Печатка господарства або клубу",
    ],
    when: "Видається при продажу племінного молодняку. Обов'язковий для участі у виставках ARBA/BRC та офіційного схрещування.",
    note: "Без родоводу тварина не може бути зареєстрована як племінна. Купівля без родоводу — ризик прихованого інбридингу та невідомих вад.",
  },
  {
    id: "animal-card",
    icon: "🗂️",
    name: "Картка тварини (Individual record)",
    purpose:
      "Внутрішній документ господарства для ведення обліку кожної тварини",
    contains: [
      "Всі ідентифікаційні дані",
      "Дані про батьків та 2 покоління предків",
      "Зважування по контрольних датах",
      "Оцінка екстер'єру",
      "Всі злучки та їх результати (для самок)",
      "Медичні маніпуляції (вакцинація, лікування)",
      "Дата вибуття та причина (забій, продаж, загибель)",
    ],
    when: "Ведеться з народження до вибуття. Основний документ племінного обліку на фермі.",
    note: "Рекомендовано зберігати 3–5 років після вибуття тварини для аналізу показників нащадків.",
  },
  {
    id: "mating-journal",
    icon: "📔",
    name: "Журнал злучок та окролів",
    purpose: "Хронологічний облік всіх злучок та результатів розмноження",
    contains: [
      "Дати злучок по кожній самці",
      "Номери самців-плідників",
      "Очікувані та фактичні дати окролів",
      "Розмір та якість посліду",
      "Виживаність молодняку до відлучення",
      "Коефіцієнт відтворення по самках",
    ],
    when: "Ведеться постійно. Основа для аналізу репродуктивних показників стада.",
    note: "Дозволяє виявити самок з низькою відтворюваністю та плідників з поганими результатами.",
  },
  {
    id: "herd-book",
    icon: "📚",
    name: "Племінна книга (Stud book)",
    purpose: "Офіційний реєстр племінних тварин господарства або клубу",
    contains: [
      "Всі тварини племінного стада",
      "Класифікація: клас еліта, І клас, ІІ клас",
      "Оцінки та родоводи",
      "Дані про продаж та придбання",
    ],
    when: "Ведеться постійно. Для зареєстрованих господарств — обов'язково.",
    note: "Офіційна племінна книга дозволяє отримати статус племінного господарства та вищу ціну на молодняк.",
  },
  {
    id: "vet-passport",
    icon: "💉",
    name: "Ветеринарний паспорт",
    purpose: "Документ про стан здоров'я та проведені медичні маніпуляції",
    contains: [
      "Ідентифікаційні дані тварини",
      "Графік та дати вакцинацій (ВГХК, міксоматоз)",
      "Дегельмінтизація",
      "Лікування та хвороби",
      "Підпис та печатка ветеринара",
    ],
    when: "Обов'язковий при продажу, транспортуванні через кордон, участі у виставках.",
    note: "Без ветеринарного паспорту неможливо легально транспортувати кролів між регіонами.",
  },
];

const inbreedingLevels: InbreedingLevel[] = [
  {
    coefficient: "0%",
    label: "Аутбридинг",
    meaning: "Відсутність спільних предків у 4 поколіннях",
    recommendation:
      "Оптимально для масового розведення. Максимальний гетерозис",
    color: "#27500A",
    bg: "#EAF3DE",
  },
  {
    coefficient: "1–6%",
    label: "Легкий інбридинг",
    meaning: "Дуже далека спорідненість — правнуки",
    recommendation:
      "Допустимо. Мінімальний ризик. Закріплення типу без суттєвого накопичення рецесивних генів",
    color: "#3B6D11",
    bg: "#C0DD97",
  },
  {
    coefficient: "6–12%",
    label: "Помірний інбридинг",
    meaning: "Онуки–дідусі/бабусі; двоюрідні",
    recommendation:
      "Використовувати обережно. Прийнятно при відмінному здоров'ї обох батьків і відсутності відомих вад у роді",
    color: "#BA7517",
    bg: "#FAEEDA",
  },
  {
    coefficient: "12–25%",
    label: "Тісний інбридинг",
    meaning: "Батько–дочка; мати–син; рідні брат–сестра",
    recommendation:
      "Небажано. Різко підвищує ризик прояву рецесивних вад. Допустимо тільки для виявлення носіїв дефектів (тест-схрещування)",
    color: "#633806",
    bg: "#FFE0DE",
  },
  {
    coefficient: "25%+",
    label: "Крайній інбридинг",
    meaning: "Батько–дочка з вже спорідненими батьками; і т.д.",
    recommendation:
      "Суворо заборонено в комерційному розведенні. Призводить до інбредної депресії: зниження виживаності, плодючості, появи вад",
    color: "#8B0000",
    bg: "#FFD0D0",
  },
];

const lineTerms: LineDesc[] = [
  {
    term: "Лінія (line)",
    definition:
      "Група тварин, пов'язаних спільним видатним предком і подібних за ключовими ознаками",
    example: "Лінія Граніта — всі нащадки плідника Граніта ♂ 2021 р.",
    usage:
      "Виведення ліній — основа племінної роботи. Дозволяє стабілізувати бажані якості",
  },
  {
    term: "Родина (family)",
    definition: "Група тварин від видатної самки і її жіночих нащадків",
    example: "Родина Зірки — всі самки-нащадки самки Зірки ♀ 2020 р.",
    usage:
      "Відстежування материнських якостей: молочність, материнський інстинкт, плодючість",
  },
  {
    term: "Кросування ліній",
    definition:
      "Схрещування тварин з різних ліній для отримання гетерозисного ефекту",
    example: "♂ з лінії Граніта × ♀ з лінії Вулкана",
    usage: "F1 від кросування ліній має вищу конверсію корму та виживаність",
  },
  {
    term: "Освіження крові",
    definition:
      "Введення некорідного самця з іншого господарства при ознаках інбредної депресії",
    example: "Купівля плідника НЗБ з перевіреного господарства",
    usage: "Проводити кожні 3–4 роки навіть без явних ознак проблем",
  },
  {
    term: "Тест-схрещування",
    definition: "Спеціальне схрещування для виявлення носіїв рецесивних вад",
    example: "Підозрюваний носій × тварина з відомим генотипом",
    usage: "Виявлення носіїв малоклюзії, крипторхізму, алеля V",
  },
  {
    term: "Коефіцієнт інбридингу (F)",
    definition:
      "Математичне вираження рівня спорідненості — ймовірність що обидва алелі певного гену ідентичні за походженням",
    example: "F = 0,25 для схрещування батько–дочка",
    usage: "Для розрахунку — метод Райта або онлайн-калькулятори",
  },
];

const numberingSystem = [
  {
    system: "Татуювання у вусі",
    pros: "Постійне, дешеве, без обладнання для зчитування",
    cons: "Боляче для тварини, може бути нечитабельним з часом",
    recommended: true,
  },
  {
    system: "Мікрочіп (ISO 11784/11785)",
    pros: "Постійне, міжнародний стандарт, без болю",
    cons: "Потребує спеціального зчитувача",
    recommended: true,
  },
  {
    system: "Металеві кліщі на вухо",
    pros: "Швидко, без болю",
    cons: "Може випасти або пошкодитись",
    recommended: false,
  },
  {
    system: "Пластикові бирки на лапу",
    pros: "Різних кольорів для групового обліку",
    cons: "Тимчасові — для молодняку до переведення в стадо",
    recommended: false,
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function PedigreeRecords() {
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"animal" | "mating">("animal");

  return (
    <div className="pr2-page">
      <header className="pr2-header">
        <h1>📖 Родоводи та племінний облік</h1>
        <p>
          Ведення родоводів, племінних карток, журналів злучок і племінної
          документації. Від А до Я — для фермерського господарства та
          виставкового розведення.
        </p>
      </header>

      <div className="pr2-wrap">
        {/* НАВІЩО ВЕСТИ ОБЛІК */}
        <h2 className="pr2-section-title">Навіщо вести племінний облік</h2>
        <div className="pr2-why-grid">
          {[
            {
              icon: "🧬",
              title: "Контроль інбридингу",
              text: "Без обліку неможливо розрахувати коефіцієнт спорідненості. Непомітний інбридинг за 3–4 покоління призводить до накопичення рецесивних вад.",
            },
            {
              icon: "📈",
              title: "Відбір за продуктивністю",
              text: "Записи про привіс, конверсію корму та розмір посліду дозволяють відібрати кращих тварин і вибракувати відстаючих.",
            },
            {
              icon: "💰",
              title: "Цінність племінного молодняку",
              text: "Тварина з документальним підтвердженим родоводом та записами коштує у 2–5 разів більше ніж без документів.",
            },
            {
              icon: "🚫",
              title: "Виявлення носіїв вад",
              text: "Облік дозволяє відстежити лінії з появою малоклюзії, крипторхізму або інших вад і вчасно вилучити носіїв.",
            },
            {
              icon: "📊",
              title: "Аналіз стада",
              text: "Журнали окролів показують середній розмір посліду, виживаність молодняку і продуктивність кожної самки.",
            },
            {
              icon: "🏆",
              title: "Участь у виставках",
              text: "ARBA, BRC та інші організації вимагають підтвердженого родоводу мінімум в 3 поколіннях для реєстрації тварини.",
            },
          ].map((w, i) => (
            <div key={i} className="pr2-why-card">
              <span className="pr2-why-icon">{w.icon}</span>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>

        {/* ІДЕНТИФІКАЦІЯ */}
        <h2 className="pr2-section-title">Ідентифікація тварин</h2>
        <p className="pr2-intro">
          Кожна племінна тварина повинна мати унікальний незмінний ідентифікатор
        </p>
        <div className="pr2-table-wrap">
          <table className="pr2-table">
            <thead>
              <tr>
                <th>Метод</th>
                <th>Переваги</th>
                <th>Недоліки</th>
                <th>Рекомендується</th>
              </tr>
            </thead>
            <tbody>
              {numberingSystem.map((n, i) => (
                <tr key={i}>
                  <td>
                    <strong>{n.system}</strong>
                  </td>
                  <td className="pr2-td-sm">{n.pros}</td>
                  <td className="pr2-td-sm">{n.cons}</td>
                  <td className="pr2-td-center">
                    {n.recommended ? (
                      <span className="pr2-yes">✓ Так</span>
                    ) : (
                      <span className="pr2-no">— Тимчасово</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pr2-note">
          <p>
            <strong>Система нумерації:</strong> Рекомендований формат — РІК +
            ЛІТЕРА ЛІНІЇ + ПОРЯДКОВИЙ НОМЕР. Приклад: <strong>25А14</strong> =
            народжений у 2025 році, лінія А, 14-й за рахунком. Це дозволяє
            одразу визначити вік і лінію тварини.
          </p>
        </div>

        {/* ПОЛЯ КАРТОК */}
        <h2 className="pr2-section-title">Поля племінних карток</h2>
        <div className="pr2-tab-row">
          <button
            className={`pr2-tab ${activeTab === "animal" ? "pr2-tab--active" : ""}`}
            onClick={() => setActiveTab("animal")}
          >
            🗂️ Картка тварини
          </button>
          <button
            className={`pr2-tab ${activeTab === "mating" ? "pr2-tab--active" : ""}`}
            onClick={() => setActiveTab("mating")}
          >
            📔 Журнал злучок
          </button>
        </div>

        <div className="pr2-table-wrap">
          <table className="pr2-table">
            <thead>
              <tr>
                <th>Поле</th>
                <th>Опис</th>
                <th>Обов'язкове</th>
                <th>Приклад</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "animal"
                ? animalCardFields
                : matingRecordFields
              ).map((f, i) => (
                <tr key={i}>
                  <td>
                    <strong>{f.field}</strong>
                  </td>
                  <td className="pr2-td-sm">{f.description}</td>
                  <td className="pr2-td-center">
                    {f.required ? (
                      <span className="pr2-req">✓ Так</span>
                    ) : (
                      <span className="pr2-opt">— Бажано</span>
                    )}
                  </td>
                  <td className="pr2-td-example">{f.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ДОКУМЕНТИ */}
        <h2 className="pr2-section-title">Типи племінних документів</h2>
        <p className="pr2-intro">
          Натисніть — склад документа та коли він потрібен
        </p>
        <div className="pr2-docs-list">
          {documentTypes.map((doc) => {
            const isOpen = activeDoc === doc.id;
            return (
              <article
                key={doc.id}
                className={`pr2-doc-card ${isOpen ? "pr2-doc-card--open" : ""}`}
                onClick={() => setActiveDoc(isOpen ? null : doc.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setActiveDoc(isOpen ? null : doc.id)
                }
              >
                <div className="pr2-doc-header">
                  <span className="pr2-doc-icon">{doc.icon}</span>
                  <div className="pr2-doc-titles">
                    <h3 className="pr2-doc-name">{doc.name}</h3>
                    <p className="pr2-doc-purpose">{doc.purpose}</p>
                  </div>
                  <span className="pr2-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="pr2-doc-details">
                    <div className="pr2-doc-block">
                      <span className="pr2-doc-label">📋 Що містить</span>
                      <ul className="pr2-doc-list">
                        {doc.contains.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pr2-doc-block">
                      <span className="pr2-doc-label">📅 Коли потрібен</span>
                      <p>{doc.when}</p>
                    </div>
                    <div className="pr2-doc-block pr2-doc-block--note">
                      <span className="pr2-doc-label">💡 Важливо</span>
                      <p>{doc.note}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ІНБРИДИНГ */}
        <h2 className="pr2-section-title">
          Коефіцієнт інбридингу — таблиця рівнів
        </h2>
        <p className="pr2-intro">
          F — коефіцієнт інбридингу за Райтом. Показує ймовірність
          гомозиготності за будь-яким геном
        </p>
        <div className="pr2-inbreeding-list">
          {inbreedingLevels.map((lvl, i) => (
            <div
              key={i}
              className="pr2-inbreeding-card"
              style={{ borderColor: lvl.color + "44", background: lvl.bg }}
            >
              <div className="pr2-inbreeding-left">
                <span
                  className="pr2-inbreeding-coef"
                  style={{ color: lvl.color }}
                >
                  {lvl.coefficient}
                </span>
                <span
                  className="pr2-inbreeding-label"
                  style={{ color: lvl.color }}
                >
                  {lvl.label}
                </span>
              </div>
              <div className="pr2-inbreeding-right">
                <p className="pr2-inbreeding-meaning">{lvl.meaning}</p>
                <p className="pr2-inbreeding-rec">
                  <strong>Рекомендація:</strong> {lvl.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ЛІНІЇ ТА ТЕРМІНИ */}
        <h2 className="pr2-section-title">Терміни племінної роботи</h2>
        <p className="pr2-intro">
          Натисніть — визначення, приклад та практичне застосування
        </p>
        <div className="pr2-terms-list">
          {lineTerms.map((t) => {
            const isOpen = activeTerm === t.term;
            return (
              <div
                key={t.term}
                className={`pr2-term-card ${isOpen ? "pr2-term-card--open" : ""}`}
                onClick={() => setActiveTerm(isOpen ? null : t.term)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setActiveTerm(isOpen ? null : t.term)
                }
              >
                <div className="pr2-term-header">
                  <strong className="pr2-term-name">{t.term}</strong>
                  <p className="pr2-term-def">{t.definition}</p>
                  <span className="pr2-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="pr2-term-details">
                    <div className="pr2-term-block pr2-term-block--example">
                      <span className="pr2-term-label">📌 Приклад</span>
                      <p>{t.example}</p>
                    </div>
                    <div className="pr2-term-block">
                      <span className="pr2-term-label">🔧 Застосування</span>
                      <p>{t.usage}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ПРАКТИЧНІ ПОРАДИ */}
        <h2 className="pr2-section-title">
          Практичні поради для ведення обліку
        </h2>
        <div className="pr2-tips-grid">
          {[
            {
              icon: "📱",
              title: "Цифровий облік",
              text: "Таблиці Google Sheets або спеціалізовані програми (RabbitryManager, Breedtrak) — пошук, фільтрація та автоматичні розрахунки інбридингу",
            },
            {
              icon: "📁",
              title: "Резервна копія",
              text: "Зберігайте дані у двох місцях — паперова картотека + цифрова копія. Пожежа або поломка комп'ютера не повинні знищити роками зібрані дані",
            },
            {
              icon: "✍️",
              title: "Записувати одразу",
              text: "Правило: не відкладати запис на потім. Заповнювати картку в день народження посліду, одразу після зважування",
            },
            {
              icon: "🖼️",
              title: "Фото при народженні",
              text: "Фотографія крільченят при народженні + підпис з кількістю — мінімум 5 хвилин часу, максимум користі для архіву",
            },
            {
              icon: "🔢",
              title: "Татуювати в 3–4 тижні",
              text: "Оптимальний вік для татуювання — 3–4 тижні. Вухо вже достатньо велике, кролик ще молодий і спокійний",
            },
            {
              icon: "📊",
              title: "Річний аналіз",
              text: "Раз на рік аналізуйте журнал: середній розмір посліду, виживаність, СДП. Тварини нижче середнього — кандидати на вибраковку",
            },
          ].map((t, i) => (
            <div key={i} className="pr2-tip-card">
              <span className="pr2-tip-icon">{t.icon}</span>
              <h3 className="pr2-tip-title">{t.title}</h3>
              <p className="pr2-tip-text">{t.text}</p>
            </div>
          ))}
        </div>

        {/* АЛЕРТИ */}
        <h2 className="pr2-section-title">Важливо</h2>
        <div className="pr2-alert danger">
          🚨 Купівля тварини без родоводу — ризик придбання носія прихованих
          спадкових вад або тварини з невідомим рівнем інбридингу
        </div>
        <div className="pr2-alert warn">
          ⚠️ Без ідентифікації тварин (татуювання або чіп) племінний облік
          неможливий — переплутати тварин одного кольору легко
        </div>
        <div className="pr2-alert warn">
          ⚠️ Коефіцієнт інбридингу вище 12% без чіткого плану та здорових
          предків — серйозний ризик для стада
        </div>
        <div className="pr2-alert ok">
          ✓ Мінімальний облік для початку: картка тварини + журнал злучок. Цього
          достатньо для контролю інбридингу та відбору
        </div>

        <div className="pr2-note" style={{ marginTop: "1.5rem" }}>
          <p>
            <strong>Джерела:</strong> ARBA — Guide to Raising and Showing
            Rabbits; BRC — Breeding Records and Stud Book Guidelines; Sandford
            J.C. — The Domestic Rabbit (5th ed.); Wright S. — Coefficients of
            Inbreeding and Relationship (1922); Lebas F. et al. — The Rabbit,
            FAO 1997.
          </p>
        </div>
      </div>
      <div className="pr2-back">
        <Link to="/" className="pr2-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
