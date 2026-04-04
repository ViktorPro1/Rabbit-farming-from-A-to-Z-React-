import { Link } from "react-router-dom";
import "./FirstAid.css";

const poisonPlants = [
  {
    plant: "Молочай (Euphorbia)",
    danger: "Дуже токсичний — всі частини",
    symptoms: "Слинотеча, виразки рота, пронос, судоми",
  },
  {
    plant: "Блекота (Hyoscyamus)",
    danger: "Смертельно токсична",
    symptoms: "Розширення зіниць, судоми, кома, загибель",
  },
  {
    plant: "Беладонна (Atropa)",
    danger: "Смертельно токсична",
    symptoms: "Збудження, судоми, параліч",
  },
  {
    plant: "Нарцис, тюльпан (цибулини)",
    danger: "Токсичні, особливо цибулини",
    symptoms: "Блювання (рідко), пронос, тремтіння",
  },
  {
    plant: "Плющ (Hedera)",
    danger: "Токсичний — листя та ягоди",
    symptoms: "Слинотеча, пронос, неврологічні симптоми",
  },
  {
    plant: "Рододендрон, азалія",
    danger: "Дуже токсичні",
    symptoms: "Слабкість, повільний пульс, колапс",
  },
  {
    plant: "Картопля (зелена, паростки)",
    danger: "Соланін — токсичний",
    symptoms: "Слинотеча, пронос, слабкість",
  },
  {
    plant: "Цибуля, часник",
    danger: "Анемія при регулярному вживанні",
    symptoms: "Анемія, слабкість, при великій дозі — гостра реакція",
  },
  {
    plant: "Авокадо",
    danger: "Персин — токсичний",
    symptoms: "Дихальна недостатність, набряки, загибель",
  },
  {
    plant: "Бузина (листя, незрілі ягоди)",
    danger: "Токсична",
    symptoms: "Пронос, слинотеча, нудота",
  },
  {
    plant: "Дурман (Datura)",
    danger: "Смертельно токсичний",
    symptoms: "Збудження, галюцинації, тахікардія, загибель",
  },
  {
    plant: "Лілія (всі види)",
    danger: "Токсична, особливо квіти та пилок",
    symptoms: "Ниркова недостатність, блювання",
  },
];

const FirstAid = () => {
  return (
    <main className="firstaid-page">
      <div className="firstaid-header">
        <h1>🚑 Перша допомога кролику</h1>
        <p>Покрокові інструкції для господаря</p>
      </div>

      <div className="firstaid-wrap">
        <div className="firstaid-grid">
          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">🌡️</span>
              <h3>Тепловий удар</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip danger">Швидко смертельний</span>
              </div>
              <p>
                <strong>Ознаки:</strong> важке дихання відкритим ротом,
                витягнутий на підлозі, не реагує, червоні вуха, судоми.
              </p>
              <ol className="firstaid-steps">
                <li>Перенести в прохолодне місце негайно</li>
                <li>Змочити вуха та лапи прохолодною (не крижаною!) водою</li>
                <li>Дати пити прохолодну воду маленькими порціями</li>
                <li>Вентилятор поряд — не направляти прямо на кролика</li>
                <li>Ветеринар — навіть якщо кролик відновився</li>
              </ol>
              <div className="firstaid-alert danger">
                🚫 Не занурювати у холодну воду — різкий перепад температур
                викликає шок.
              </div>
            </div>
          </article>

          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">🛑</span>
              <h3>ШКТ-стаз (зупинка кишечника)</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip danger">
                  Смертельно без лікування
                </span>
              </div>
              <p>
                <strong>Ознаки:</strong> відмова від їжі та води, немає посліду
                або дуже дрібний, здутий або твердий живіт, зубний скрегіт,
                сутулість, апатія.
              </p>
              <ol className="firstaid-steps">
                <li>Масаж живота круговими рухами 5–10 хв кожну годину</li>
                <li>Simethicone (Еспумізан) — 1 мл кожні 1–2 год</li>
                <li>
                  Примусове випоювання теплою водою шприцом (5–10 мл кожні 30
                  хв)
                </li>
                <li>Рух — виводити кролика, щоб рухався</li>
                <li>Якщо немає покращення за 4–6 годин — ветеринар негайно</li>
              </ol>
              <div className="firstaid-alert danger">
                🚫 Не давати знеболюючих типу анальгін — маскують симптоми.
              </div>
            </div>
          </article>

          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">⚡</span>
              <h3>Судоми та неврологічні симптоми</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip danger">Ветеринар негайно</span>
              </div>
              <p>
                <strong>Ознаки:</strong> мимовільні скорочення м'язів, обертання
                по колу, нахил голови, падіння на бік, втрата свідомості.
              </p>
              <ol className="firstaid-steps">
                <li>Забезпечити безпеку — прибрати гострі предмети поруч</li>
                <li>Не фіксувати силою під час судом — можна травмувати</li>
                <li>Покласти на м'яку поверхню горизонтально</li>
                <li>Зафіксувати час та тривалість нападу</li>
                <li>Ветеринар — негайно</li>
              </ol>
              <div className="firstaid-alert warn">
                ⚠️ Причини: E. cuniculi, отит, отруєння, тепловий удар — точний
                діагноз тільки у ветеринара.
              </div>
            </div>
          </article>

          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">🩹</span>
              <h3>Травма, падіння, зламана кінцівка</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip warn">
                  Ветеринар якнайшвидше
                </span>
              </div>
              <p>
                <strong>Ознаки:</strong> не спирається на лапу; лапа висить під
                неприродним кутом; крик або різка агресія при дотику; видима
                рана.
              </p>
              <ol className="firstaid-steps">
                <li>Не намагатися вправити або перемотати самостійно</li>
                <li>
                  Обмежити рух — помістити в невеликий переносний бокс з м'якою
                  підстилкою
                </li>
                <li>Не давати їсти — можлива операція під анестезією</li>
                <li>Тримати тепло — кролики йдуть у шок від болю</li>
                <li>Ветеринар якнайшвидше</li>
              </ol>
              <div className="firstaid-alert danger">
                🚫 Не давати знеболюючих для людей — ібупрофен та аспірин
                токсичні для кроликів.
              </div>
            </div>
          </article>

          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">🩸</span>
              <h3>Кровотеча</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip warn">Залежно від джерела</span>
              </div>
              <p>
                <strong>Зовнішня рана:</strong>
              </p>
              <ol className="firstaid-steps">
                <li>
                  Чистою тканиною або марлею притиснути рану — без відпускання
                  5–10 хв
                </li>
                <li>
                  Не промивати перекисом — руйнує тканини. Хлоргексидин або
                  фізрозчин — безпечно
                </li>
                <li>Не перетягувати лапу — порушення кровообігу</li>
                <li>При глибокій або великій рані — ветеринар</li>
              </ol>
              <p>
                <strong>Кров із носа або рота</strong> — ознака ВГХК або важкої
                травми. Ветеринар негайно, ізоляція тварини.
              </p>
              <p>
                <strong>Кров у сечі</strong> — ознака сечокам'яної хвороби або
                уроциститу. Ветеринар сьогодні.
              </p>
            </div>
          </article>

          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">☠️</span>
              <h3>Отруєння</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip danger">Ветеринар негайно</span>
              </div>
              <p>
                <strong>Ознаки:</strong> слинотеча, судоми, м'язова слабкість,
                порушення координації, важке дихання.
              </p>
              <ol className="firstaid-steps danger">
                <li>
                  Визначити що з'їв — зберегти рослину або речовину для
                  ветеринара
                </li>
                <li>Не викликати блювання — у кроликів це небезпечно</li>
                <li>Не давати молоко або «народні» антидоти</li>
                <li>Ветеринар — найшвидше можливо. Повідомити що саме з'їв.</li>
              </ol>
              <p>
                <strong>Якщо ветеринар недоступний:</strong> активоване вугілля
                1 г/кг розвести в 5 мл води та дати шприцом — лише як тимчасовий
                захід.
              </p>
            </div>
          </article>

          <article className="firstaid-card">
            <div className="firstaid-card-header">
              <span className="firstaid-icon">🍼</span>
              <h3>Крільченята без матері або відмовлені</h3>
            </div>
            <div className="firstaid-card-body">
              <div className="firstaid-chips">
                <span className="firstaid-chip warn">
                  Перші 48 год критичні
                </span>
              </div>
              <p>
                <strong>Ознаки відмови матері:</strong> самка не годує, розкидає
                крільченят, крільченята холодні, зморщені, пищать.
              </p>
              <ol className="firstaid-steps">
                <li>
                  Зігріти крільченят — загорнути у теплу тканину, температура
                  30–32°C
                </li>
                <li>Не давати коров'яче молоко — не засвоюється</li>
                <li>
                  Штучне вигодовування: козяче молоко + вершки (1:1) або Kitten
                  Milk Replacer
                </li>
                <li>
                  Годувати шприцом без голки 0,5–1 мл кожні 2–3 год перші дні
                </li>
                <li>
                  Після годування масажувати животик та генітальну зону ватним
                  диском — стимуляція дефекації
                </li>
                <li>Ветеринарна консультація щодо режиму та суміші</li>
              </ol>
              <div className="firstaid-alert ok">
                ✅ Крільченята відкривають очі на 10–12 день. До цього вони
                повністю залежать від годування кожні 2–4 год.
              </div>
            </div>
          </article>
        </div>

        <div className="firstaid-note">
          <h2 style={{ color: "#c62828" }}>😮‍💨 Задуха, синюшність губ і ясен</h2>
          <p>
            Якщо кролик дихає відкритим ротом, має синюшні або білі ясна — це
            критична ситуація:
          </p>
          <ul>
            <li>Перенести у свіже прохолодне повітря</li>
            <li>Покласти на бік горизонтально</li>
            <li>
              Перевірити рот — видалити видиме стороннє тіло пальцем або
              пінцетом (обережно)
            </li>
            <li>Ветеринар — негайно. Синюшність означає нестачу кисню.</li>
          </ul>
        </div>

        <div className="firstaid-section-title">🌿 Таблиця отруйних рослин</div>
        <div
          className="firstaid-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="firstaid-table">
              <thead>
                <tr>
                  <th>Рослина</th>
                  <th>Небезпека</th>
                  <th>Симптоми отруєння</th>
                </tr>
              </thead>
              <tbody>
                {poisonPlants.map((row) => (
                  <tr key={row.plant}>
                    <td>
                      <strong>{row.plant}</strong>
                    </td>
                    <td>{row.danger}</td>
                    <td>{row.symptoms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="firstaid-note" style={{ marginTop: "1.5rem" }}>
          <h2>🧰 Домашня аптечка господаря кроликів</h2>
          <ul>
            <li>
              <strong>Simethicone (Еспумізан)</strong> — при здутті та ШКТ-стазі
            </li>
            <li>
              <strong>Активоване вугілля</strong> — при отруєннях (тимчасово)
            </li>
            <li>
              <strong>Хлоргексидин 0,05%</strong> — промивання ран
            </li>
            <li>
              <strong>Стерильний фізрозчин</strong> — промивання очей, ран
            </li>
            <li>
              <strong>Шприци 1 мл і 5 мл без голки</strong> — примусове
              випоювання
            </li>
            <li>
              <strong>Марля та бинт</strong> — перев'язка ран
            </li>
            <li>
              <strong>Термометр ректальний</strong> — норма для кролика
              38,5–39,5°C
            </li>
            <li>
              <strong>Мелоксикам (Metacam)</strong> — знеболюючий препарат,
              безпечний для кроликів (за рецептом ветеринара)
            </li>
            <li>
              <strong>Контакт ветеринара</strong> — найважливіше
            </li>
          </ul>
        </div>

        <div className="firstaid-back">
          <Link to="/" className="firstaid-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default FirstAid;
