import { Link } from "react-router-dom";
import "./PalliativeCare.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const chronicPainSigns = [
  {
    sign: "Скрегіт зубами (тихий, майже беззвучний)",
    note: "Відрізняється від голосного скреготу гострого болю",
  },
  { sign: "Зменшена активність, довше лежить на одному місці", note: "" },
  {
    sign: "Погіршений догляд за шерстю",
    note: "Через біль важче дотягнутись, доглядати себе",
  },
  { sign: "Зміна пози в спокої — згорблена, напружена", note: "" },
  { sign: "Знижений апетит без явної гострої причини", note: "" },
  {
    sign: "Дратівливість чи, навпаки, апатія",
    note: "Зміна звичної поведінки",
  },
];

const PalliativeCare = () => {
  return (
    <main className="palliative-page">
      <div className="palliative-header">
        <h1>🕊️ Паліативний догляд і хронічний біль</h1>
        <p>Коли вилікувати вже не можна, але можна підтримати якість життя</p>
      </div>

      <div className="palliative-wrap">
        <div className="palliative-intro">
          <h2>Чому хронічний біль легко пропустити</h2>
          <p>
            Гострий біль — очевидний: кролик кричить, різко реагує, уникає
            дотику. Хронічний біль (при артриті, хронічній нирковій
            недостатності, невиліковних пухлинах) проявляється значно тонше —
            кролі, як тварини-здобич, еволюційно навчились приховувати ознаки
            слабкості, щоб не привертати увагу хижаків.
          </p>
          <div className="palliative-alert warn">
            ⚠️ Відсутність очевидних криків чи скигління не означає відсутність
            болю. Власник, що добре знає звичну поведінку свого кролика, часто
            помічає хронічний біль раніше за побіжний огляд ветеринара — саме
            через зміни в дрібних, повсякденних звичках.
          </div>
        </div>

        <div className="palliative-section-title">
          🌡️ Ознаки хронічного болю
        </div>
        <div className="palliative-table-wrap">
          <table className="palliative-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {chronicPainSigns.map((s) => (
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

        <div className="palliative-section-title">
          💊 Керування хронічним болем
        </div>
        <div className="palliative-note">
          <p>
            Мета паліативної терапії — не вилікувати основне захворювання (це
            вже неможливо), а максимально зберегти комфорт і повсякденну
            активність тварини. Це завжди спільна робота з ветеринаром: тільки
            він підбирає безпечні для тривалого застосування знеболювальні
            (найчастіше — нестероїдні протизапальні препарати типу мелоксикаму)
            і коригує дозу за потреби.
          </p>
        </div>

        <div className="palliative-section-title">
          🏠 Практична підтримка вдома
        </div>
        <div className="palliative-note">
          <ul>
            <li>
              М'яка, товста підстилка — знижує тиск на болючі суглоби чи ділянки
              тіла
            </li>
            <li>
              Легкодоступна їжа й вода — миски й годівниці на рівні, що не
              вимагає зайвих зусиль
            </li>
            <li>
              Допомога з доглядом за шерстю, якщо кролик сам не дотягується
            </li>
            <li>Мінімізація зайвих переміщень і стресу</li>
            <li>Спостереження за апетитом і кількістю посліду щодня</li>
          </ul>
        </div>

        <div className="palliative-section-title">💭 Складні рішення</div>
        <div className="palliative-note">
          <p>
            Оцінка якості життя — це не лише медичні показники, а й щоденний
            комфорт тварини: чи їсть вона з задоволенням, чи цікавиться
            довкіллям, чи є в неї більше "хороших" днів, ніж "поганих". Коли
            хронічний біль чи прогресуюча хвороба переважують можливості
            підтримувальної терапії, варто чесно обговорити з ветеринаром
            подальші кроки, включно з питанням евтаназії як гуманного завершення
            страждань, а не як "поразку" в лікуванні.
          </p>
        </div>

        <div className="palliative-note palliative-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Rabbit Welfare Association &amp; Fund (RWAF) — Recognising Pain in
              Rabbits
            </li>
            <li>House Rabbit Society — Quality of Life and End-of-Life Care</li>
          </ul>
          <p className="palliative-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="palliative-related">
          <h3 className="palliative-related-title">Читайте також</h3>
          <div className="palliative-related-grid">
            <Link to="/pain-management" className="palliative-related-link">
              🩹 Знеболення та аналгезія
            </Link>
            <Link to="/senior-rabbit" className="palliative-related-link">
              🕰️ Кролик похилого віку
            </Link>
            <Link
              to="/chronic-kidney-disease"
              className="palliative-related-link"
            >
              🩺 Хронічна ниркова недостатність
            </Link>
          </div>
        </div>

        <div className="palliative-back">
          <Link to="/" className="palliative-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Паліативний догляд і хронічний біль у кролів" />
        </div>
      </div>
    </main>
  );
};

export default PalliativeCare;
