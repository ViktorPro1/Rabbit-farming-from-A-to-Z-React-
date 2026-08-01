import { Link } from "react-router-dom";
import "./UmbilicalHernia.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const signs = [
  {
    sign: "Невелика м'яка припухлість у ділянці пупка",
    note: "Найчастіше помітна в перші дні–тижні життя",
  },
  {
    sign: "Припухлість зменшується при легкому натисканні",
    note: "Ознака справжньої грижі — вміст вправляється назад",
  },
  {
    sign: "Кроленя загалом активне, ссе молоко",
    note: "При неускладненій грижі загальний стан не страждає",
  },
  {
    sign: "Різке збільшення, почервоніння, гарячість ділянки",
    note: "Тривожна ознака — можливе защемлення",
  },
  {
    sign: "Кроленя раптово млявіє, відмовляється від ссання",
    note: "Невідкладна ознака при защемленій грижі",
  },
];

const UmbilicalHernia = () => {
  return (
    <main className="hernia-page">
      <div className="hernia-header">
        <h1>🍼 Пупкова грижа у новонароджених кроленят</h1>
        <p>
          Невеликий дефект черевної стінки — коли спостерігати, а коли діяти
        </p>
      </div>

      <div className="hernia-wrap">
        <div className="hernia-intro">
          <h2>Що це таке</h2>
          <p>
            Пупкова грижа — це дефект у черевній стінці в місці, де раніше
            проходила пуповина, через який частина жирової тканини чи кишківника
            може випинатись під шкіру. У кроленят це вроджена особливість,
            пов'язана з неповним закриттям черевної стінки після народження.
          </p>
          <div className="hernia-alert ok">
            ✅ Більшість дрібних пупкових гриж у кроленят не завдають болю й не
            заважають нормальному розвитку. Багато з них зменшуються самостійно
            протягом перших місяців життя, коли черевна стінка остаточно
            зміцнюється.
          </div>
        </div>

        <div className="hernia-section-title">🌡️ На що звертати увагу</div>
        <div className="hernia-table-wrap">
          <table className="hernia-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {signs.map((s) => (
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
        <div className="hernia-alert danger">
          🔴 Защемлена грижа — коли частина кишківника потрапляє в грижовий
          мішок і не може вправитись назад, порушуючи кровопостачання, — це
          невідкладна хірургічна ситуація. Ознаки: різке ущільнення й болючість
          припухлості, млявість кроленяти, відмова від їжі. Потрібен негайний
          огляд ветеринара.
        </div>

        <div className="hernia-section-title">🧪 Що робить ветеринар</div>
        <div className="hernia-note">
          <p>
            При огляді ветеринар визначає розмір дефекту й чи вправляється вміст
            грижі назад у черевну порожнину. Дрібні, безболісні грижі, що легко
            вправляються, часто рекомендують просто спостерігати — багато з них
            закриваються самостійно з ростом тварини.
          </p>
          <p>
            Великі грижі, ті, що не зменшуються з віком, або будь-яка ознака
            защемлення потребують хірургічного закриття дефекту. Операцію
            найчастіше поєднують із плановою кастрацією чи стерилізацією, якщо
            грижа не защемлена і немає екстреної потреби оперувати раніше.
          </p>
        </div>

        <div className="hernia-section-title">🏠 Що робити власнику вдома</div>
        <div className="hernia-note">
          <ul>
            <li>Не намагайтесь самостійно вправляти чи стискати припухлість</li>
            <li>
              Регулярно оглядайте ділянку пупка в перші тижні життя кроленят
            </li>
            <li>
              Покажіть ветеринару навіть невелику грижу для первинної оцінки
            </li>
            <li>
              Слідкуйте за змінами розміру, кольору чи поведінки кроленяти
            </li>
          </ul>
        </div>

        <div className="hernia-note hernia-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Merck (MSD) Veterinary Manual — Congenital and Inherited Anomalies
              of the Digestive System
            </li>
            <li>VCA Animal Hospitals — Umbilical Hernias in Small Mammals</li>
          </ul>
          <p className="hernia-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="hernia-related">
          <h3 className="hernia-related-title">Читайте також</h3>
          <div className="hernia-related-grid">
            <Link to="/okril" className="hernia-related-link">
              🍼 Окріл
            </Link>
            <Link to="/postpartum-care" className="hernia-related-link">
              🍼 Догляд за самкою після окролу
            </Link>
            <Link to="/neutering" className="hernia-related-link">
              ⚕️ Кастрація та стерилізація
            </Link>
          </div>
        </div>

        <div className="hernia-back">
          <Link to="/" className="hernia-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Пупкова грижа у новонароджених кроленят" />
        </div>
      </div>
    </main>
  );
};

export default UmbilicalHernia;
