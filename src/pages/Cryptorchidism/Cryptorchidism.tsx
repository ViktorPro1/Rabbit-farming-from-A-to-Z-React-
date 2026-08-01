import { Link } from "react-router-dom";
import "./Cryptorchidism.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const RabbitCryptorchidism = () => {
  return (
    <main className="cryptorchid-page">
      <div className="cryptorchid-header">
        <h1>🔎 Крипторхізм у кролів</h1>
        <p>
          Коли одне чи обидва яєчка не опустились у калитку — що це означає для
          розведення й здоров'я
        </p>
      </div>

      <div className="cryptorchid-wrap">
        <div className="cryptorchid-intro">
          <h2>Що це таке</h2>
          <p>
            У кролів яєчка в нормі опускаються в калитку до статевого
            дозрівання, хоча, на відміну від багатьох ссавців, кролі зберігають
            відкритий пахвинний канал усе життя й здатні втягувати яєчка назад у
            черевну порожнину (це називають нормальним фізіологічним рефлексом,
            а не патологією). Справжній крипторхізм — це коли одне (однобічний)
            чи обидва (двобічний) яєчка так і не опустились у калитку до
            статевого дозрівання й залишаються в черевній порожнині чи
            пахвинному каналі постійно.
          </p>
          <div className="cryptorchid-alert warn">
            ⚠️ Через здатність кролів втягувати яєчка, візуальний огляд молодого
            самця не завжди остаточно підтверджує чи спростовує крипторхізм —
            іноді потрібен повторний огляд чи пальпація досвідченим фахівцем.
          </div>
        </div>

        <div className="cryptorchid-section-title">
          🐇 Значення для племінної роботи
        </div>
        <div className="cryptorchid-note">
          <p>
            Крипторхізм вважається спадковою вадою і є підставою для
            вибракування тварини з розведення — див. статтю "Дискваліфікаційні
            вади". Не рекомендується використовувати такого самця для парувань,
            навіть якщо непошкоджене яєчко залишається фертильним, щоб не
            передавати схильність нащадкам.
          </p>
        </div>

        <div className="cryptorchid-section-title">🩺 Ризики для здоров'я</div>
        <div className="cryptorchid-note">
          <ul>
            <li>
              Яєчко, що залишилось у черевній порожнині, розвивається за
              температури тіла, вищої за нормальну для калитки — це підвищує
              довгостроковий ризик пухлинного переродження тканини яєчка
            </li>
            <li>
              Крипторхічне яєчко зазвичай не виробляє життєздатну сперму через
              підвищену температуру, хоча гормональна функція може зберігатись
            </li>
            <li>
              При однобічному крипторхізмі друге, нормально опущене яєчко
              зазвичай залишається фертильним
            </li>
          </ul>
        </div>

        <div className="cryptorchid-section-title">💊 Що робити</div>
        <div className="cryptorchid-note">
          <p>
            Єдиний надійний підхід — хірургічне видалення непошкодженого яєчка
            (черевна орхідектомія), яке технічно складніше за стандартну
            кастрацію, оскільки потребує доступу до черевної порожнини. Операцію
            зазвичай рекомендують провести якомога раніше після підтвердження
            діагнозу через довгостроковий ризик пухлини.
          </p>
        </div>

        <div className="cryptorchid-note cryptorchid-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Merck (MSD) Veterinary Manual — Disorders of the Testes and
              Scrotum
            </li>
            <li>House Rabbit Society — Neutering Male Rabbits</li>
          </ul>
          <p className="cryptorchid-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="cryptorchid-related">
          <h3 className="cryptorchid-related-title">Читайте також</h3>
          <div className="cryptorchid-related-grid">
            <Link
              to="/disqualifying-faults"
              className="cryptorchid-related-link"
            >
              ❌ Дискваліфікаційні вади
            </Link>
            <Link to="/neutering" className="cryptorchid-related-link">
              ⚕️ Кастрація та стерилізація
            </Link>
            <Link to="/sexing" className="cryptorchid-related-link">
              🔎 Визначення статі
            </Link>
            <Link to="/select-buck" className="cryptorchid-related-link">
              ♂️ Вибір племінного самця
            </Link>
          </div>
        </div>

        <div className="cryptorchid-back">
          <Link to="/" className="cryptorchid-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Крипторхізм у кролів" />
        </div>
      </div>
    </main>
  );
};

export default RabbitCryptorchidism;
