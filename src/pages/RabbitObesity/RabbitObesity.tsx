import { Link } from "react-router-dom";
import "./RabbitObesity.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const consequences = [
  {
    icon: "💩",
    name: "Заборона цекотрофії",
    desc: "Кролик не може дотягнутись і з'їсти цекотрофи — дефіцит вітамінів.",
  },
  {
    icon: "🦶",
    name: "Пододерматит",
    desc: "Надлишкова вага збільшує тиск на підошви лап.",
  },
  {
    icon: "💧",
    name: "Опік сечею",
    desc: "Неможливість прийняти правильну позу для сечовипускання.",
  },
  {
    icon: "🩺",
    name: "Абсцеси",
    desc: "Ожиріння підвищує ризик і ускладнює хірургічне лікування.",
  },
  {
    icon: "🧶",
    name: "Вовняна пробка",
    desc: "Малорухливість сповільнює моторику ШКТ.",
  },
  {
    icon: "🩺",
    name: "Ускладнена анестезія",
    desc: "Вищий ризик при будь-якій операції, зокрема стерилізації.",
  },
];

const RabbitObesity = () => {
  return (
    <main className="obesity-page">
      <div className="obesity-header">
        <h1>⚖️ Ожиріння у кролів</h1>
        <p>
          Як безпечно оцінити й знизити вагу — цілісний погляд замість
          розкиданих порад
        </p>
      </div>

      <div className="obesity-wrap">
        <div className="obesity-intro">
          <h2>Чому ожиріння — не просто "естетична" проблема</h2>
          <p>
            На відміну від багатьох інших проблем зі здоров'ям, ожиріння у
            кролів рідко викликає прямі й очевидні симптоми саме через зайву
            вагу. Натомість воно діє як каталізатор для цілого ряду інших
            небезпечних станів — і саме тому контроль ваги заслуговує окремої,
            цілісної уваги, а не розкиданих згадок по різних статтях.
          </p>
          <div className="obesity-alert danger">
            🔴 Ожиріння підвищує ризик пододерматиту, опіку сечею, абсцесів,
            вовняної пробки, ускладненого дистоції, ускладненої анестезії й
            гіршого прогнозу при абсцесах щелепи. Це не окрема проблема, а
            фактор ризику для доброго десятка інших хвороб одночасно.
          </div>
        </div>

        <div className="obesity-section-title">
          ⚠️ До чого призводить надмірна вага
        </div>
        <div className="obesity-causes-grid">
          {consequences.map((c) => (
            <article key={c.name} className="obesity-cause-card">
              <div className="obesity-cause-header">
                <span className="obesity-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="obesity-cause-desc">{c.desc}</p>
            </article>
          ))}
        </div>

        <div className="obesity-section-title">📏 Як оцінити вагу</div>
        <div className="obesity-note">
          <p>
            Основний інструмент — шкала кондиції тіла (BCS) від 1 до 5, де
            оцінюють на дотик виступання хребта й ребер (детальніше — у статті
            "Кондиція тіла (BCS)"). На відміну від цифри на вагах, BCS враховує
            будову конкретної тварини й дозволяє відстежувати динаміку, а не
            орієнтуватись на абстрактну "норму ваги для породи".
          </p>
        </div>

        <div className="obesity-section-title">
          🥕 Як безпечно знижувати вагу
        </div>
        <div className="obesity-note">
          <ul>
            <li>
              Зниження ваги має бути поступовим — різке голодування кролика
              небезпечне і може спровокувати ШКТ-стаз чи навіть жирову дистрофію
              печінки
            </li>
            <li>
              Основа раціону лишається сіном у необмеженій кількості — обмежують
              саме гранульований комбікорм і висококалорійні ласощі, а не сіно
            </li>
            <li>
              Поступово збільшуйте фізичну активність — більше простору для
              руху, іграшки, що стимулюють рух за їжею (форейджинг)
            </li>
            <li>
              Зважуйте регулярно (раз на 1–2 тижні) для контролю динаміки, а не
              щодня
            </li>
            <li>
              Будь-яку програму зниження ваги для кролика з підозрою на супутні
              хвороби варто узгоджувати з ветеринаром
            </li>
          </ul>
        </div>
        <div className="obesity-alert warn">
          ⚠️ Кролик не може блювати, а різке зниження споживання їжі здатне
          викликати серйозні ускладнення з боку печінки чи ШКТ. Зниження ваги —
          це керований, поступовий процес, а не голодування.
        </div>

        <div className="obesity-section-title">🛡️ Профілактика</div>
        <div className="obesity-facts-grid">
          <div className="obesity-fact-card ok">
            <h3>✅ Сіно — основа раціону</h3>
            <p>Гранули й ласощі — в чітко обмеженій кількості.</p>
          </div>
          <div className="obesity-fact-card ok">
            <h3>✅ Достатньо простору для руху</h3>
            <p>
              Активність запобігає накопиченню ваги набагато ефективніше, ніж
              жорстка дієта.
            </p>
          </div>
          <div className="obesity-fact-card warn">
            <h3>⚠️ Регулярний контроль BCS</h3>
            <p>Раз на місяць — щоб помітити тенденцію до набору ваги рано.</p>
          </div>
        </div>

        <div className="obesity-note obesity-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Rabbit Welfare Association &amp; Fund (RWAF) — Obesity in Rabbits
            </li>
            <li>House Rabbit Society — Body Condition Score</li>
          </ul>
          <p className="obesity-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="obesity-related">
          <h3 className="obesity-related-title">Читайте також</h3>
          <div className="obesity-related-grid">
            <Link to="/rabbit-body-condition" className="obesity-related-link">
              📏 Кондиція тіла (BCS)
            </Link>
            <Link to="/feeding" className="obesity-related-link">
              🥕 Годування
            </Link>
            <Link to="/weight-control" className="obesity-related-link">
              ⚖️ Контроль ваги
            </Link>
            <Link to="/urine-scald" className="obesity-related-link">
              🔥 Опік сечею
            </Link>
          </div>
        </div>

        <div className="obesity-back">
          <Link to="/" className="obesity-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Ожиріння у кролів" />
        </div>
      </div>
    </main>
  );
};

export default RabbitObesity;
