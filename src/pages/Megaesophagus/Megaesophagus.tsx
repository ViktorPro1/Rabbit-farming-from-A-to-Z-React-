import { Link } from "react-router-dom";
import "./Megaesophagus.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const symptoms = [
  {
    sign: "Регургітація (не блювання)",
    note: "Пасивне повернення неперетравленої їжі з стравоходу",
  },
  { sign: "Втрата ваги", note: "Їжа не досягає шлунка в достатній кількості" },
  { sign: "Слабкість, анорексія", note: "" },
  {
    sign: "Задишка, ознаки пневмонії",
    note: "Через потрапляння вмісту в дихальні шляхи (аспірацію)",
  },
  { sign: "М'язова атрофія", note: "При тривалому перебігу" },
];

const Megaesophagus = () => {
  return (
    <main className="megaesophagus-page">
      <div className="megaesophagus-header">
        <h1>🫁 Мегаезофагус у кролів</h1>
        <p>
          Надзвичайно рідкісний стан — але важливо вміти відрізнити його від
          звичної регургітації чи ШКТ-стазу
        </p>
      </div>

      <div className="megaesophagus-wrap">
        <div className="megaesophagus-intro">
          <div className="megaesophagus-alert warn">
            ⚠️ Чесно попереджаємо: на момент публікації в світовій ветеринарній
            літературі задокументовано лише один підтверджений випадок
            мегаезофагусу у кролика — опублікований у 2023 році. Це означає, що
            стан вкрай рідкісний, і якщо ваш кролик має симптоми, описані нижче,
            значно ймовірніше, що причина інша (найчастіше — ШКТ-стаз чи
            проблеми із зубами), а не саме мегаезофагус. Ця стаття — для
            загального розуміння, а не сигнал панікувати.
          </div>
        </div>

        <div className="megaesophagus-section-title">Що це таке</div>
        <div className="megaesophagus-note">
          <p>
            Мегаезофагус — розширення стравоходу з порушенням його моторики
            (перистальтики), через що їжа затримується в стравоході замість
            того, щоб рухатись у шлунок. У собак і котів стан добре вивчений і
            трапляється значно частіше; у кролів же перший і єдиний
            опублікований випадок описував дорослого самця вислухої породи,
            якого спершу лікували від ШКТ-стазу й стоматологічних проблем — а
            справжній діагноз встановили лише на розтині.
          </p>
          <p>
            Розрізняють вроджену форму (з'являється в молодому віці, пов'язана з
            порушенням розвитку нервово-м'язового апарату стравоходу) та набуту
            (розвивається пізніше, часто на тлі інших системних хвороб —
            наприклад, генералізованої м'язової слабкості, як це і було в
            задокументованому випадку в кроля).
          </p>
        </div>

        <div className="megaesophagus-section-title">🌡️ Симптоми</div>
        <div className="megaesophagus-table-wrap">
          <table className="megaesophagus-table">
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
        <div className="megaesophagus-alert danger">
          🔴 Ключова відмінність від звичайного зниженого апетиту при ШКТ-стазі
          — саме регургітація (їжа повертається назовні майже незміненою, часто
          невдовзі після їди), а не просто відмова від їжі. Але оскільки кролик
          фізично не може блювати, будь-яку подібну картину все одно варто
          показати ветеринару якнайшвидше — незалежно від точного діагнозу.
        </div>

        <div className="megaesophagus-section-title">🧪 Діагностика</div>
        <div className="megaesophagus-note">
          <p>
            Рентген грудної клітки — основний метод виявлення розширеного
            стравоходу. Оскільки стан вкрай рідкісний і легко сплутати з іншими,
            набагато поширенішими проблемами, ветеринар спершу виключає типові
            причини зниженого апетиту й регургітаційної поведінки —
            стоматологічні проблеми, ШКТ-стаз, чужорідне тіло. Головне
            ускладнення, яке шукають додатково, — аспіраційна пневмонія, що
            розвивається, коли вміст стравоходу потрапляє в легені.
          </p>
        </div>

        <div className="megaesophagus-section-title">💊 Лікування</div>
        <div className="megaesophagus-note">
          <p>
            Специфічного лікування самого мегаезофагусу немає — терапія
            спрямована на першопричину (якщо її вдається встановити) та на
            полегшення симптомів: годування невеликими порціями, підтримання
            тварини у вертикальнішому положенні під час і після їжі, щоб сила
            тяжіння допомагала їжі рухатись у шлунок, антибіотики за ознак
            аспіраційної пневмонії.
          </p>
          <p className="megaesophagus-note-small">
            У задокументованому випадку в кроля, попри лікування, прогноз
            виявився несприятливим — тварина загинула через 16 днів від
            ускладнень (аспіраційної пневмонії). Це підкреслює, наскільки
            серйозним є цей рідкісний стан, якщо він все ж трапляється.
          </p>
        </div>

        <div className="megaesophagus-note megaesophagus-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Muffat-es-Jacques et al. — Megaoesophagus in a pet rabbit,
              Veterinary Record Case Reports, 2023 (перший і єдиний
              опублікований випадок)
            </li>
            <li>
              Merck (MSD) Veterinary Manual — Congenital and Inherited Anomalies
              of the Esophagus in Animals
            </li>
            <li>
              VCA Animal Hospitals — Megaesophagus (загальна ветеринарна довідка
              по інших видах для контексту)
            </li>
          </ul>
          <p className="megaesophagus-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара. Через крайню рідкісність стану остаточний діагноз
            можливий лише після виключення значно типовіших причин.
          </p>
        </div>

        <div className="megaesophagus-related">
          <h3 className="megaesophagus-related-title">Читайте також</h3>
          <div className="megaesophagus-related-grid">
            <Link to="/diseases" className="megaesophagus-related-link">
              🩺 Хвороби
            </Link>
            <Link to="/symptoms" className="megaesophagus-related-link">
              🌡️ Симптоматичний пошук
            </Link>
            <Link to="/wool-block" className="megaesophagus-related-link">
              🧶 Вовняна пробка
            </Link>
          </div>
        </div>

        <div className="megaesophagus-back">
          <Link to="/" className="megaesophagus-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Мегаезофагус у кролів" />
        </div>
      </div>
    </main>
  );
};

export default Megaesophagus;
