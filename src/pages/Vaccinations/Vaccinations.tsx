import { useState } from "react";
import { Link } from "react-router-dom";
import "./Vaccinations.css";

const fmt = (d: Date) => d.toLocaleDateString("uk-UA");
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const addYears = (d: Date, n: number) => {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() + n);
  return r;
};

const Vaccinations = () => {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<React.ReactNode>(null);

  const calculate = () => {
    if (!birthDate) {
      setResult(<p className="vacc-error">Введіть дату народження.</p>);
      return;
    }
    const d = new Date(birthDate);
    const micro1 = addDays(d, 6 * 7);
    const vhd1 = addDays(d, 10 * 7);
    const micro2 = addYears(micro1, 1);
    const vhd2 = addYears(vhd1, 1);
    setResult(
      <div className="vacc-result">
        <div className="vacc-result-block">
          <div className="vacc-result-title">💉 Міксоматоз</div>
          <div className="vacc-row">
            <span>Перше щеплення:</span>
            <strong>{fmt(micro1)}</strong>
          </div>
          <div className="vacc-row">
            <span>Ревакцинація:</span>
            <strong>{fmt(micro2)}</strong>
          </div>
        </div>
        <div className="vacc-result-block">
          <div className="vacc-result-title">💉 VHD (ВГХК)</div>
          <div className="vacc-row">
            <span>Перше щеплення:</span>
            <strong>{fmt(vhd1)}</strong>
          </div>
          <div className="vacc-row">
            <span>Ревакцинація:</span>
            <strong>{fmt(vhd2)}</strong>
          </div>
        </div>
        <div className="vacc-alert ok">
          ✅ Далі — щорічна ревакцинація обох вакцин.
        </div>
      </div>,
    );
  };

  return (
    <main className="vacc-page">
      <div className="vacc-header">
        <h1>💉 Вакцинація та профілактика кроликів</h1>
        <p>Повний довідник щеплень, графіків та профілактики</p>
      </div>

      <div className="vacc-wrap">
        <div className="vacc-section">
          <h2>1. Вступ</h2>
          <p>
            Цей довідник призначено для господарів будь-якого рівня досвіду. Він
            містить докладну інформацію про всі вакцини, графіки щеплень, умови
            зберігання, побічні ефекти, профілактику паразитів, гігієну кліток
            та харчування. Навіть новачок зможе забезпечити максимальний захист
            своїх кроликів, дотримуючись рекомендацій.
          </p>
          <p>
            Кролики є дуже чутливими до інфекцій. Навіть при хорошому догляді
            вони можуть підхопити захворювання через контакт із дикими
            кроликами, іншими тваринами або переносниками інфекцій. Тому
            вакцинація — обов'язковий захід для безпечного утримання тварин.
          </p>
        </div>

        <div className="vacc-section">
          <h2>2. Навіщо вакцинувати кроликів</h2>
          <p>Вакцинація — це не рекомендація, а базова необхідність. Вона:</p>
          <ul>
            <li>Захищає молодих кроликів від смертельних інфекцій.</li>
            <li>Знижує ризик поширення хвороб у господарстві.</li>
            <li>Дозволяє планувати розведення без масових втрат.</li>
            <li>Підвищує загальний імунітет поголів'я.</li>
            <li>
              Дозволяє уникнути фінансових витрат на лікування та ветеринарні
              послуги.
            </li>
          </ul>
        </div>

        <div className="vacc-section">
          <h2>3. Основні вакцини</h2>

          <div className="vacc-grid">
            <article className="vacc-card">
              <div className="vacc-card-header">
                <span className="vacc-icon">🦠</span>
                <h3>Міксоматоз</h3>
              </div>
              <ul>
                <li>
                  <strong>Для чого:</strong> Захист від вірусної інфекції, що
                  передається через комах і контакт із хворими кроликами.
                </li>
                <li>
                  <strong>Перше щеплення:</strong> 6 тижнів від народження.
                </li>
                <li>
                  <strong>Ревакцинація:</strong> кожні 6–12 місяців.
                </li>
                <li>
                  <strong>Зберігання:</strong> 2–8°C, захист від світла, не
                  заморожувати.
                </li>
                <li>
                  <strong>Побічні ефекти:</strong> Легка слабкість, підвищення
                  температури 1–2 дні.
                </li>
                <li>
                  <strong>Додатково:</strong> Під час спалахів міксоматозу
                  вакцинація рятує більшість тварин.
                </li>
              </ul>
            </article>

            <article className="vacc-card">
              <div className="vacc-card-header">
                <span className="vacc-icon">🩸</span>
                <h3>Вірусна геморагічна хвороба (VHD)</h3>
              </div>
              <ul>
                <li>
                  <strong>Для чого:</strong> Захист від смертельного вірусу
                  RHDV1 та RHDV2.
                </li>
                <li>
                  <strong>Перше щеплення:</strong> 9–10 тижнів від народження.
                </li>
                <li>
                  <strong>Ревакцинація:</strong> кожні 12 місяців.
                </li>
                <li>
                  <strong>Зберігання:</strong> 2–8°C, уникати прямих сонячних
                  променів.
                </li>
                <li>
                  <strong>Побічні ефекти:</strong> Легка реакція, зазвичай
                  переноситься добре.
                </li>
              </ul>
            </article>

            <article className="vacc-card">
              <div className="vacc-card-header">
                <span className="vacc-icon">💊</span>
                <h3>Інші вакцини</h3>
              </div>
              <ul>
                <li>
                  Інфекційний ринотрахеїт — рекомендовано при великій кількості
                  кроликів.
                </li>
                <li>Бактеріальні інфекції — за порадою ветеринара.</li>
                <li>
                  Профілактика паразитів — регулярна обробка кліток і тварин.
                </li>
              </ul>
            </article>
          </div>
        </div>

        <div className="vacc-section">
          <h2>4. Графік вакцинацій</h2>
          <ul>
            <li>
              <strong>6 тижнів</strong> — міксоматоз (перше щеплення)
            </li>
            <li>
              <strong>9–10 тижнів</strong> — VHD (перше щеплення)
            </li>
            <li>
              <strong>6 місяців</strong> — повторне щеплення міксоматозу (за
              потреби)
            </li>
            <li>
              <strong>12 місяців</strong> — ревакцинація обох вакцин
            </li>
            <li>
              <strong>Далі</strong> — щорічна ревакцинація
            </li>
          </ul>
        </div>

        <div className="vacc-section">
          <h2>5. Профілактика без вакцинацій</h2>
          <p>
            Якщо кролика не вакцинували, ризик хвороб зростає у 10–20 разів.
            Основні рекомендації:
          </p>
          <ul>
            <li>Обмежити контакт із іншими тваринами.</li>
            <li>Своєчасно звертатися до ветеринара при змінах поведінки.</li>
            <li>
              Підтримувати чистоту клітки, дезінфекцію підстилки та інвентарю.
            </li>
            <li>Правильне харчування і режим дня.</li>
            <li>Регулярна обробка від паразитів.</li>
          </ul>
        </div>

        <div className="vacc-section">
          <h2>6. Профілактика паразитів</h2>
          <ul>
            <li>Препарати від бліх та кліщів (за ветеринарною порадою).</li>
            <li>Антигельмінтні засоби — для боротьби з глистами.</li>
            <li>Регулярне очищення клітки і підстилки.</li>
            <li>Сезонні огляди ветеринаром.</li>
          </ul>
        </div>

        <div className="vacc-section">
          <h2>7. Клітка та гігієна</h2>
          <ul>
            <li>Щоденне очищення підстилки.</li>
            <li>Мийка поїлок та годівниць кожен день.</li>
            <li>Регулярна дезінфекція клітки.</li>
            <li>Захист від протягів та вологи.</li>
            <li>Періодична заміна підстилки.</li>
          </ul>
        </div>

        <div className="vacc-section">
          <h2>8. Харчування та режим</h2>
          <ul>
            <li>Свіжий сіно або трава щодня.</li>
            <li>Сухий корм — обмежено, відповідно до віку.</li>
            <li>Свіжа вода — постійно.</li>
            <li>Вітаміни та мінерали — за потреби, за порадою ветеринара.</li>
            <li>Режим дня — постійний світловий цикл, уникати стресу.</li>
          </ul>
        </div>

        <div className="vacc-section">
          <h2>9. Калькулятор вакцинацій</h2>
          <p>
            Введіть дату народження кролика, щоб отримати дати першого щеплення
            та ревакцинацій.
          </p>
          <div className="vacc-calculator">
            <label className="vacc-label">Дата народження кролика:</label>
            <input
              type="date"
              className="vacc-date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setResult(null);
              }}
            />
            <button className="vacc-btn" onClick={calculate}>
              Розрахувати дати вакцинації
            </button>
            {result}
          </div>
        </div>

        <div className="vacc-back">
          <Link to="/" className="vacc-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Vaccinations;
