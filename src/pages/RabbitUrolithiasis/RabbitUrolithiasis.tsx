import { Link } from "react-router-dom";
import "./RabbitUrolithiasis.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const riskFactors = [
  {
    icon: "🌿",
    name: "Люцернове сіно/гранули",
    desc: "Люцерна значно багатша на кальцій, ніж трав'яне сіно — головний харчовий фактор ризику.",
    facts: [
      "Замінюйте на трав'яне сіно (тимофіївка)",
      "Гранули з люцерни — в обмеженій кількості",
    ],
  },
  {
    icon: "💧",
    name: "Недостатнє споживання води",
    desc: "Зневоднений організм концентрує сечу, кристали швидше злипаються.",
    facts: ["Постійний доступ до чистої води", "Соковита зелень додає рідини"],
  },
  {
    icon: "⚖️",
    name: "Ожиріння й малорухливість",
    desc: "Сеча застоюється в міхурі довше, ніж потрібно.",
    facts: ["Контроль ваги", "Регулярний рух і активність"],
  },
  {
    icon: "🦴",
    name: "Застій сечі з інших причин",
    desc: "Артрит, E. cuniculi, травми хребта, біль у лапах — усе, що обмежує рух.",
    facts: [
      "Лікуйте супутні причини болю",
      "Своєчасно звертайтесь до ветеринара",
    ],
  },
];

const symptoms = [
  {
    sign: "Густа, крейдоподібна сеча",
    note: "Не плутати з нормальною каламутністю",
  },
  { sign: "Часті спроби помочитись малими порціями", note: "Видимі зусилля" },
  {
    sign: "Кров у сечі",
    note: "Відрізнити від рослинних пігментів тест-смужкою",
  },
  { sign: "Зменшення апетиту, млявість", note: "" },
  { sign: "Скрегіт зубами", note: "Ознака болю" },
  { sign: "Забруднення шерсті сечею", note: "Ризик опіку сечею" },
  {
    sign: "Повна відсутність сечовипускання",
    note: "Невідкладна ситуація — закупорка",
  },
];

const RabbitUrolithiasis = () => {
  return (
    <main className="uroliths-page">
      <div className="uroliths-header">
        <h1>💧 Сечокам'яна хвороба та "пісок" у сечі</h1>
        <p>
          Гіперкальціурія — особливість обміну кальцію, яка робить кролів
          унікальними серед ссавців
        </p>
      </div>

      <div className="uroliths-wrap">
        <div className="uroliths-intro">
          <h2>Чому це трапляється саме у кролів</h2>
          <p>
            На відміну від більшості ссавців, кролі всмоктують кальцій з їжі
            пропорційно до його вмісту в раціоні — незалежно від фактичної
            потреби організму. Надлишок виводиться нирками, тому здорова сеча
            кролика в нормі каламутна від кристалів карбонату кальцію. Проблема
            виникає, коли цього надлишку стає забагато.
          </p>
          <p>
            Осад згущується до консистенції крейди чи навіть зубної пасти —
            "сечовий пісок" (гіперкальціурія). Він подразнює слизову міхура й
            уретри. Якщо процес триває довго, можуть сформуватись справжні
            камені (уроліти).
          </p>
          <div className="uroliths-alert ok">
            ✅ Сам факт наявності осаду кальцію в сечі — це ще не хвороба. У
            здорового кроля зі збалансованим раціоном значний осад — рідкість.
            Головне — чи є клінічні прояви.
          </div>
        </div>

        <div className="uroliths-section-title">⚠️ Що підвищує ризик</div>
        <div className="uroliths-causes-grid">
          {riskFactors.map((r) => (
            <article key={r.name} className="uroliths-cause-card">
              <div className="uroliths-cause-header">
                <span className="uroliths-cause-icon">{r.icon}</span>
                <h2>{r.name}</h2>
              </div>
              <p className="uroliths-cause-desc">{r.desc}</p>
              <ul className="uroliths-cause-facts">
                {r.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="uroliths-section-title">🌡️ Симптоми</div>
        <div className="uroliths-table-wrap">
          <table className="uroliths-table">
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
        <div className="uroliths-alert warn">
          ⚠️ Забарвлена сеча — часто не привід для паніки: колір нормальної сечі
          варіюється від блідо-жовтого до майже червоного залежно від з'їдених
          рослин. Відрізнити кров від пігментів можна лише тест-смужкою у
          ветеринара.
        </div>

        <div className="uroliths-section-title">🧪 Діагностика</div>
        <div className="uroliths-note">
          <ul>
            <li>Загальний аналіз сечі</li>
            <li>
              Рентген черевної порожнини — осад і камені зазвичай добре видно
            </li>
            <li>УЗД за потреби для деталізації</li>
            <li>
              Пошук супутньої причини застою сечі — артрит, вага, E. cuniculi
            </li>
          </ul>
        </div>

        <div className="uroliths-section-title">💊 Лікування</div>
        <div className="uroliths-note">
          <p>
            Для легких випадків зазвичай достатньо консервативної терапії:
            більше води й рідкого раціону, корекція кальцію, більше руху.
          </p>
          <p>
            Якщо не спрацьовує — ручне випорожнення міхура чи промивання
            (флашинг) під седацією. Справжні великі камені, що не виходять
            самостійно, потребують хірургічного видалення. Контрольні рентгени
            зазвичай кожні 2–4 тижні.
          </p>
        </div>

        <div className="uroliths-section-title">🛡️ Профілактика</div>
        <div className="uroliths-facts-grid">
          <div className="uroliths-fact-card ok">
            <h3>✅ Трав'яне сіно замість люцерни</h3>
            <p>Тимофіївка та подібні трави — основа раціону.</p>
          </div>
          <div className="uroliths-fact-card ok">
            <h3>✅ Достатньо води й овочів</h3>
            <p>
              Постійний доступ до чистої води, соковита зелень для додаткової
              рідини.
            </p>
          </div>
          <div className="uroliths-fact-card warn">
            <h3>⚠️ Контроль ваги й рух</h3>
            <p>Не тримайте кролика малорухливим.</p>
          </div>
          <div className="uroliths-fact-card warn">
            <h3>⚠️ Не прибирайте кальцій повністю</h3>
            <p>
              Він потрібен для росту зубів і кісток — мета збалансованість, а не
              мінімізація.
            </p>
          </div>
        </div>

        <div className="uroliths-note uroliths-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Rabbit Welfare Association & Fund (RWAF) — Urolithiasis (Urinary
              Sludge & Stones)
            </li>
            <li>House Rabbit Network — Bladder Sludge in Rabbits</li>
            <li>
              dvm360 — Rabbit calcium metabolism, "bladder sludge," and
              urolithiasis
            </li>
            <li>
              Improve International — Lower urinary tract disease of small
              mammals
            </li>
          </ul>
          <p className="uroliths-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="uroliths-related">
          <h3 className="uroliths-related-title">Читайте також</h3>
          <div className="uroliths-related-grid">
            <Link to="/urine-scald" className="uroliths-related-link">
              🔥 Опік сечею
            </Link>
            <Link to="/feeding" className="uroliths-related-link">
              🥕 Годування
            </Link>
            <Link to="/weight-control" className="uroliths-related-link">
              ⚖️ Контроль ваги
            </Link>
            <Link
              to="/encephalitozoon-cuniculi"
              className="uroliths-related-link"
            >
              🧠 E. cuniculi
            </Link>
          </div>
        </div>

        <div className="uroliths-back">
          <Link to="/" className="uroliths-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Сечокам'яна хвороба у кролів" />
        </div>
      </div>
    </main>
  );
};

export default RabbitUrolithiasis;
