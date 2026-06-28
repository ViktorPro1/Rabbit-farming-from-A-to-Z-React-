import { Link } from "react-router-dom";
import "./VetTemperature.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const ranges = [
  {
    label: "Гіпотермія",
    range: "нижче 37.9°C",
    color: "blue",
    desc: "Критично. Зігрів, ветеринар негайно.",
    icon: "🥶",
  },
  {
    label: "Знижена",
    range: "38.0–38.4°C",
    color: "cyan",
    desc: "Стрес, переохолодження, шок. Спостереження.",
    icon: "⬇️",
  },
  {
    label: "Норма",
    range: "38.5–39.9°C",
    color: "green",
    desc: "Здоровий кролик у стані спокою.",
    icon: "✓",
  },
  {
    label: "Субфебрилітет",
    range: "40.0–40.5°C",
    color: "yellow",
    desc: "Можлива легка інфекція або стрес від вимірювання.",
    icon: "⬆️",
  },
  {
    label: "Гіпертермія",
    range: "вище 40.6°C",
    color: "red",
    desc: "Тепловий удар або серйозна інфекція. Ветеринар.",
    icon: "🔴",
  },
];

const steps = [
  "Підготуй: цифровий термометр, мастило (вазелін або дитячий крем), серветка, помічник.",
  "Кроля тримай горизонтально на поверхні або на колінах. Помічник фіксує тіло та передні лапи.",
  "Нанеси тонкий шар мастила на кінчик термометра (перші 1,5–2 см).",
  "Підніми хвіст кроля і обережно введи термометр на 1,5–2 см у пряму кишку. Рухи повільні, без зусиль.",
  "Тримай до сигналу. Після виймай так само повільно.",
  "Запиши результат, дезінфікуй термометр спиртом.",
];

const VetTemperature = () => {
  return (
    <main className="vt-page">
      <div className="vt-hero">
        <span>🌡️</span>
        <h1>Вимірювання температури</h1>
        <p>Ректальна температура — швидкий об'єктивний показник стану кроля</p>
      </div>

      <section className="vt-section">
        <h2>Норми температури</h2>
        <p className="vt-intro">
          Норма для дорослого кроля — <strong>38.5–39.9°C</strong> ректально.
          Вимірювання на вухах або носі не дає достовірного результату. Врахуй:
          температура може бути трохи вищою одразу після фізичного навантаження
          або при стресі від самого вимірювання.
        </p>
        <div className="vt-ranges">
          {ranges.map((r) => (
            <div key={r.label} className={`vt-range vt-range--${r.color}`}>
              <span className="vt-range-icon">{r.icon}</span>
              <div className="vt-range-body">
                <div className="vt-range-header">
                  <strong>{r.label}</strong>
                  <span className="vt-range-value">{r.range}</span>
                </div>
                <span className="vt-range-desc">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vt-section">
        <h2>Техніка вимірювання</h2>
        <div className="vt-warning">
          <span>⚠️</span>
          <p>
            Пряма кишка у кролів тонка і чутлива. Якщо кролик різко смикнувся —
            не рухай термометр, виймай. Ніколи не застосовуй силу.
          </p>
        </div>
        <div className="vt-steps">
          {steps.map((s, i) => (
            <div key={i} className="vt-step">
              <div className="vt-step-num">{i + 1}</div>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vt-section">
        <h2>Який термометр</h2>
        <div className="vt-thermometers">
          <div className="vt-thermo vt-thermo--yes">
            <div className="vt-thermo-header">
              <span>✓</span>
              <strong>Цифровий ректальний</strong>
            </div>
            <p>
              Оптимальний. Швидкий сигнал (30–60 сек), точний, гнучкий. Шукай з
              гнучким або тонким кінчиком.
            </p>
          </div>
          <div className="vt-thermo vt-thermo--warn">
            <div className="vt-thermo-header">
              <span>~</span>
              <strong>Інфрачервоний вушний</strong>
            </div>
            <p>
              Недостовірний для кролів. Анатомія вуха відрізняється від собак та
              котів. Для орієнтиру — підходить, для діагностики — ні.
            </p>
          </div>
          <div className="vt-thermo vt-thermo--no">
            <div className="vt-thermo-header">
              <span>✗</span>
              <strong>Ртутний скляний</strong>
            </div>
            <p>
              Небезпечний — може розбитися при різкому русі кроля. Не
              використовувати.
            </p>
          </div>
        </div>
      </section>

      <section className="vt-section">
        <h2>Коли вимірювати</h2>
        <div className="vt-when-list">
          <div className="vt-when-item">
            <span>🔍</span>
            <span>Кролик млявий, не їсть, сидить «горбом»</span>
          </div>
          <div className="vt-when-item">
            <span>🔍</span>
            <span>Підозра на тепловий удар (літо, спека)</span>
          </div>
          <div className="vt-when-item">
            <span>🔍</span>
            <span>Підозра на переохолодження (крільченята, зима)</span>
          </div>
          <div className="vt-when-item">
            <span>🔍</span>
            <span>
              Перед дзвінком ветеринару — щоб повідомити точний показник
            </span>
          </div>
          <div className="vt-when-item">
            <span>🔍</span>
            <span>Моніторинг під час лікування (раз на добу)</span>
          </div>
        </div>
      </section>
      <div className="vt-back">
        <Link to="/" className="vt-back-link">
          ← Головна
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default VetTemperature;
