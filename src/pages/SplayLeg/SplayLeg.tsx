import { Link } from "react-router-dom";
import "./SplayLeg.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const causes = [
  {
    icon: "🧬",
    name: "Спадковість",
    desc: "Основна причина: слабкі зв'язки й суглоби передаються від батьків.",
    facts: [
      "Частіше у великих порід (фландр, баран, міні рекс)",
      "Не використовувати таких тварин у розведенні",
    ],
  },
  {
    icon: "🧊",
    name: "Слизька підлога",
    desc: "У перші дні–тижні життя — критичний період формування кульшового суглоба.",
    facts: [
      "Гладкі поверхні (пластик, ламінат) — фактор ризику",
      "Текстурована підстилка з перших днів",
    ],
  },
  {
    icon: "🩹",
    name: "Травма конкретної лапки",
    desc: "Дає схожу картину, але це вже не вроджена вада.",
    facts: [
      "Потребує іншого підходу до лікування",
      "Визначає ветеринар після огляду",
    ],
  },
  {
    icon: "🧠",
    name: "Неврологічні причини",
    desc: "Травма чи аномалія хребта, ураження нервів при E. cuniculi.",
    facts: [
      "Може супроводжуватись іншими неврологічними ознаками",
      "Потребує ширшої діагностики",
    ],
  },
];

const SplayLeg = () => {
  return (
    <main className="splay-page">
      <div className="splay-header">
        <h1>🦵 Розведені лапки у кроленят (splay leg)</h1>
        <p>
          Коли лапка "з'їжджає" вбік — вроджена вада чи наслідок слизької
          підлоги
        </p>
      </div>

      <div className="splay-wrap">
        <div className="splay-intro">
          <h2>Що це таке</h2>
          <p>
            Розведені лапки — стан, коли одна чи кілька лапок кроленяти не
            можуть триматись під тілом у нормальному положенні і розходяться
            вбік, часто "жабкою". Найчастіше уражаються задні лапки. Прояв
            можливий від народження до приблизно 4 тижнів життя.
          </p>
          <div className="splay-alert danger">
            🔴 Кульшовий суглоб кроленяти остаточно формується приблизно до 8–10
            тижнів життя. Якщо проблему помітити й почати коригувати рано, шанси
            на повне виправлення значно вищі. Після 3 місяців фіксація лапок уже
            практично не допомагає.
          </div>
        </div>

        <div className="splay-section-title">🔍 Причини</div>
        <div className="splay-causes-grid">
          {causes.map((c) => (
            <article key={c.name} className="splay-cause-card">
              <div className="splay-cause-header">
                <span className="splay-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="splay-cause-desc">{c.desc}</p>
              <ul className="splay-cause-facts">
                {c.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="splay-section-title">
          🩹 Гоблінг — м'яка фіксація лапок
        </div>
        <div className="splay-note">
          <p>
            Скакальні суглоби легко зв'язують еластичним самоклейним бинтом так,
            щоб між ними залишалось приблизно 1–2 см, спонукаючи лапки триматись
            під тілом.
          </p>
          <ul>
            <li>Починати якомога раніше — ідеально у віці 10 днів – 4 тижні</li>
            <li>
              Бинт м'який, не тугий — перевіряти щодня на кровообіг і
              подразнення
            </li>
            <li>Змінювати кожні 3–5 днів, весь курс 4–6 тижнів</li>
            <li>Додатково допомагає текстурована підлога й пасивні вправи</li>
          </ul>
          <div className="splay-alert warn">
            ⚠️ Гоблінг ефективний лише для молодих кроленят з легкою–помірною
            формою. Для дорослих тварин чи важких вроджених деформацій метод не
            працює. Узгоджуйте процедуру з ветеринаром.
          </div>
        </div>

        <div className="splay-section-title">🏠 Якщо випадок важкий</div>
        <div className="splay-note">
          <p>
            Двобічні важкі випадки можуть означати хронічні проблеми з
            рухливістю на все життя — ризик пододерматиту, опіку сечею. За умови
            адаптованих умов (м'яка нековзка підстилка, пандуси, низький лоток)
            можливе повноцінне життя.
          </p>
        </div>

        <div className="splay-section-title">🛡️ Профілактика</div>
        <div className="splay-facts-grid">
          <div className="splay-fact-card ok">
            <h3>✅ Нековзка підлога з перших днів</h3>
            <p>Рушники, солома, фліс замість голого пластику чи сітки.</p>
          </div>
          <div className="splay-fact-card ok">
            <h3>✅ Збалансований раціон самки</h3>
            <p>Достатній рівень кальцію у тільної та лактуючої самки.</p>
          </div>
          <div className="splay-fact-card warn">
            <h3>⚠️ Вибракування спадкових випадків</h3>
            <p>
              Не використовувати в розведенні тварин з підтвердженою спадковою
              формою.
            </p>
          </div>
        </div>

        <div className="splay-note splay-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Furry Critter Network — Splayed Legs in Rabbits</li>
            <li>Rabbit Hole Hay — What Is Splay Leg in Rabbits</li>
            <li>The Voyage — Rabbit Splay Leg: Causes and Care</li>
          </ul>
          <p className="splay-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="splay-related">
          <h3 className="splay-related-title">Читайте також</h3>
          <div className="splay-related-grid">
            <Link to="/weaning" className="splay-related-link">
              🥣 Відлучення та дорощування
            </Link>
            <Link to="/artificial-feeding" className="splay-related-link">
              🥛 Штучне вигодовування
            </Link>
            <Link to="/encephalitozoon-cuniculi" className="splay-related-link">
              🧠 E. cuniculi
            </Link>
          </div>
        </div>

        <div className="splay-back">
          <Link to="/" className="splay-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Розведені лапки у кроленят" />
        </div>
      </div>
    </main>
  );
};

export default SplayLeg;
