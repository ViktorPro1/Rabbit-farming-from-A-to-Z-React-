import { Link } from "react-router-dom";
import "./PostpartumCare.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const normalSigns = [
  {
    sign: "Знижений апетит у перші години",
    note: "Норма, має відновитись протягом доби",
  },
  {
    sign: "Самка виривала пух і облаштувала гніздо",
    note: "Ознака нормальної материнської поведінки",
  },
  {
    sign: "Кроленята лежать купкою, животики круглі",
    note: "Ознака, що вони наситились молоком",
  },
  {
    sign: "Самка годує коротко, раз-два на добу",
    note: "Нормальна поведінка кроля — на відміну від багатьох тварин",
  },
  {
    sign: "Невелика кількість посліду в перший день",
    note: "Може тимчасово зменшитись",
  },
];

const dangerSigns = [
  {
    sign: "Повна відмова від їжі понад 12–24 години",
    note: "Тривожний сигнал — можливий токсикоз чи мастит",
  },
  { sign: "Гарячі, набряклі молочні залози", note: "Ознака маститу" },
  {
    sign: "Кроленята розкидані, холодні, животики порожні",
    note: "Самка не годує — можлива проблема з молоком чи здоров'ям",
  },
  { sign: "Виражена млявість самки", note: "Потребує негайного огляду" },
  {
    sign: "Кров'янисті чи гнійні виділення",
    note: "Ознака ускладнень пологів",
  },
];

const PostpartumCare = () => {
  return (
    <main className="postpartum-page">
      <div className="postpartum-header">
        <h1>🍼 Догляд за самкою в перші 48 годин після окролу</h1>
        <p>Коли норма, а коли — сигнал тривоги в найкритичніший період</p>
      </div>

      <div className="postpartum-wrap">
        <div className="postpartum-intro">
          <h2>Чому перші 48 годин особливі</h2>
          <p>
            Одразу після пологів організм самки перебудовується — це період
            найвищого ризику одразу кількох станів: маститу, токсикозу тільності
            (якщо він не проявився до пологів), а також перших ознак проблем із
            приплодом. Водночас частина цілком нормальної поведінки кролиці
            лякає недосвідчених власників без причини.
          </p>
          <div className="postpartum-alert ok">
            ✅ Кролиці — на відміну від багатьох інших ссавців — годують малят
            лише раз чи два на добу, зазвичай на кілька хвилин. Якщо ви не
            бачите самку біля гнізда більшість часу — це нормально, а не ознака
            того, що вона покинула кроленят.
          </div>
        </div>

        <div className="postpartum-section-title">✅ Що є нормою</div>
        <div className="postpartum-table-wrap">
          <table className="postpartum-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {normalSigns.map((s) => (
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

        <div className="postpartum-section-title">🔴 Коли тривожитись</div>
        <div className="postpartum-table-wrap">
          <table className="postpartum-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {dangerSigns.map((s) => (
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

        <div className="postpartum-section-title">
          👀 Щоденний контрольний огляд
        </div>
        <div className="postpartum-note">
          <ul>
            <li>
              Перерахуйте кроленят і приберіть мертвонароджених, якщо такі є
            </li>
            <li>
              Перевірте животики кроленят — круглі й наповнені означають, що
              вони їдять
            </li>
            <li>
              Огляньте молочні залози самки на предмет почервоніння чи гарячих
              ділянок
            </li>
            <li>Переконайтесь, що самка їсть і п'є нормально протягом доби</li>
            <li>Перевірте наявність посліду в клітці самки</li>
          </ul>
        </div>
        <div className="postpartum-alert warn">
          ⚠️ Не турбуйте гніздо без потреби перші кілька днів — зайвий стрес
          може спровокувати канібалізм чи відмову від приплоду в деяких самок,
          особливо первісток.
        </div>

        <div className="postpartum-section-title">
          🥕 Харчування самки в цей період
        </div>
        <div className="postpartum-note">
          <p>
            Годуюча самка потребує більше калорій і води, ніж зазвичай —
            лактація забирає значні ресурси організму. Забезпечте необмежений
            доступ до сіна, свіжої води та поступово збільшену кількість
            гранульованого корму відповідно до зростаючих потреб лактації.
          </p>
        </div>

        <div className="postpartum-note postpartum-sources">
          <h3>Пов'язані стани, на які варто звернути увагу в цей період</h3>
          <ul>
            <li>Мастит — запалення молочних залоз</li>
            <li>
              Токсикоз тільності — якщо симптоми проявляються вже після пологів
            </li>
            <li>Дистоція — якщо пологи ще не повністю завершились</li>
            <li>
              Канібалізм чи відмова від приплоду — окремо в статті про окріл
            </li>
          </ul>
          <p className="postpartum-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="postpartum-related">
          <h3 className="postpartum-related-title">Читайте також</h3>
          <div className="postpartum-related-grid">
            <Link to="/okril" className="postpartum-related-link">
              🍼 Окріл
            </Link>
            <Link to="/mastitis" className="postpartum-related-link">
              🍼 Мастит
            </Link>
            <Link to="/dystocia" className="postpartum-related-link">
              🚨 Дистоція
            </Link>
            <Link to="/artificial-feeding" className="postpartum-related-link">
              🥛 Штучне вигодовування
            </Link>
          </div>
        </div>

        <div className="postpartum-back">
          <Link to="/" className="postpartum-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Догляд за самкою в перші 48 годин після окролу" />
        </div>
      </div>
    </main>
  );
};

export default PostpartumCare;
