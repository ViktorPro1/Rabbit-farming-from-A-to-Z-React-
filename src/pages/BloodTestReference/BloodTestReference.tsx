import { Link } from "react-router-dom";
import "./BloodTestReference.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const hematology = [
  {
    param: "Гематокрит (PCV)",
    value: "30–50 %",
    note: "Низький — анемія; високий — зневоднення",
  },
  {
    param: "Гемоглобін (Hb)",
    value: "8–17 г/дл",
    note: "Оцінюється разом з гематокритом",
  },
  {
    param: "Еритроцити (RBC)",
    value: "4–7 млн/мкл",
    note: "Низькі — анемія; високі — зневоднення",
  },
  {
    param: "Лейкоцити (WBC)",
    value: "6–13 тис/мкл",
    note: "Підвищені — запалення чи інфекція",
  },
  {
    param: "Лімфоцити",
    value: "30–85 %",
    note: "У кролів у нормі переважають над нейтрофілами",
  },
  {
    param: "Нейтрофіли",
    value: "20–60 %",
    note: "Підвищені — гостре запалення чи стрес",
  },
  {
    param: "Тромбоцити",
    value: "250–650 тис/мкл",
    note: "Низькі — ризик кровотеч",
  },
];

const biochemistry = [
  {
    param: "Загальний білок",
    value: "50–75 г/л",
    note: "Низький — виснаження, хвороби печінки/нирок",
  },
  {
    param: "Глюкоза",
    value: "75–140 мг/дл",
    note: "Підвищена часто через стрес чи біль",
  },
  {
    param: "Сечовина (BUN)",
    value: "13–30 мг/дл",
    note: "Підвищена — можливе порушення функції нирок",
  },
  {
    param: "Креатинін",
    value: "0,5–2,6 мг/дл",
    note: "Разом з BUN — підозра на ниркову недостатність",
  },
  {
    param: "АЛТ (ALT)",
    value: "55–260 МО/л",
    note: "Підвищений — можливе ураження печінки",
  },
  {
    param: "АСТ (AST)",
    value: "10–98 МО/л",
    note: "Менш специфічний для печінки у кролів",
  },
  {
    param: "Загальний кальцій",
    value: "5,5–12,5 мг/дл",
    note: "Природно варіюється залежно від раціону",
  },
];

const BloodTestReference = () => {
  return (
    <main className="bloodtest-page">
      <div className="bloodtest-header">
        <h1>🧪 Розшифровка аналізу крові кролика</h1>
        <p>Орієнтовні норми показників — щоб розуміти висновок лабораторії</p>
      </div>

      <div className="bloodtest-wrap">
        <div className="bloodtest-intro">
          <div className="bloodtest-alert warn">
            ⚠️ Норми в різних лабораторій можуть відрізнятись залежно від
            обладнання. Орієнтуйтесь передусім на референсні значення бланку
            вашої лабораторії. Один показник поза нормою рідко означає хворобу —
            інтерпретацію робить ветеринар у комплексі з оглядом.
          </div>
        </div>

        <div className="bloodtest-section-title">
          🩸 Загальний аналіз крові (гематологія)
        </div>
        <div className="bloodtest-table-wrap">
          <table className="bloodtest-table">
            <thead>
              <tr>
                <th>Показник</th>
                <th>Норма</th>
                <th>Про що каже відхилення</th>
              </tr>
            </thead>
            <tbody>
              {hematology.map((r) => (
                <tr key={r.param}>
                  <td>
                    <strong>{r.param}</strong>
                  </td>
                  <td className="bloodtest-value">{r.value}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bloodtest-alert ok">
          ✅ У здорових кролів зазвичай переважають лімфоцити над нейтрофілами
          (на відміну від собак чи котів) — це нормальна видова особливість.
        </div>

        <div className="bloodtest-section-title">
          🧬 Біохімічний аналіз крові
        </div>
        <div className="bloodtest-table-wrap">
          <table className="bloodtest-table">
            <thead>
              <tr>
                <th>Показник</th>
                <th>Норма</th>
                <th>Про що каже відхилення</th>
              </tr>
            </thead>
            <tbody>
              {biochemistry.map((r) => (
                <tr key={r.param}>
                  <td>
                    <strong>{r.param}</strong>
                  </td>
                  <td className="bloodtest-value">{r.value}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bloodtest-section-title">
          ⚡ Чому у кролів аналізи "особливі"
        </div>
        <div className="bloodtest-note">
          <ul>
            <li>
              Сам забір крові чи візит до клініки може тимчасово підняти рівень
              глюкози через стрес
            </li>
            <li>
              Обмін кальцію унікальний — залежить від раціону, а не лише потреби
              організму
            </li>
            <li>
              Референсні значення залежать від породи, віку, статі й вагітності
            </li>
          </ul>
        </div>

        <div className="bloodtest-section-title">
          📅 Коли варто робити аналіз
        </div>
        <div className="bloodtest-facts-grid">
          <div className="bloodtest-fact-card ok">
            <h3>✅ Планові огляди</h3>
            <p>Дорослі й літні кролі — раз на рік.</p>
          </div>
          <div className="bloodtest-fact-card ok">
            <h3>✅ Перед операцією</h3>
            <p>Кастрація, стерилізація.</p>
          </div>
          <div className="bloodtest-fact-card warn">
            <h3>⚠️ Незрозуміла млявість</h3>
            <p>Зниження апетиту, втрата ваги.</p>
          </div>
          <div className="bloodtest-fact-card warn">
            <h3>⚠️ Хронічні хвороби</h3>
            <p>Контроль стану нирок і печінки.</p>
          </div>
        </div>

        <div className="bloodtest-note bloodtest-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Merck (MSD) Veterinary Manual — Hematology (Complete Blood Count)
              Reference Ranges
            </li>
            <li>
              MediRabbit.com — Complete blood count and biochemistry reference
              values in rabbits
            </li>
          </ul>
          <p className="bloodtest-disclaimer">
            Матеріал має ознайомчий характер і не замінює консультацію
            ліцензованого ветеринара.
          </p>
        </div>

        <div className="bloodtest-related">
          <h3 className="bloodtest-related-title">Читайте також</h3>
          <div className="bloodtest-related-grid">
            <Link to="/vet-fecal-sample" className="bloodtest-related-link">
              🧫 Збір калу на аналіз
            </Link>
            <Link to="/lab-diagnostics" className="bloodtest-related-link">
              🧪 Лабораторна діагностика
            </Link>
            <Link to="/senior-rabbit" className="bloodtest-related-link">
              🕰️ Кролик похилого віку
            </Link>
          </div>
        </div>

        <div className="bloodtest-back">
          <Link to="/" className="bloodtest-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Розшифровка аналізу крові кролика" />
        </div>
      </div>
    </main>
  );
};

export default BloodTestReference;
