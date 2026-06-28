import { useState } from "react";
import { Link } from "react-router-dom";
import "./OkrilControl.css";
import ShareButton from "../../components/ShareButton/ShareButton";

// Контрольна злучка — повторне підсаджування самки до самця через 5–7 днів
// після основної злучки, щоб перевірити чи вона завагітніла

const controlMatingReactions = [
  {
    reaction: "Тікає, лягає на живіт, агресивно відганяє",
    meaning: "✅ Вагітна",
    action: "Одразу відсадити самку, більше не підсаджувати",
    color: "ok",
  },
  {
    reaction: "Спокійно підпускає, злучка відбувається",
    meaning: "❌ Не завагітніла",
    action: "Фіксуємо нову дату злучки — відлік починається заново",
    color: "warn",
  },
  {
    reaction: "Спочатку опирається, потім підпускає",
    meaning: "⚠️ Неоднозначно",
    action: "Відсадити і на 12–14-й день від першої злучки зробити пальпацію",
    color: "neutral",
  },
];

const gestationVariants = [
  {
    icon: "🐇",
    title: "Великоплідний послід (8+ кроленят)",
    timing: "28–29 днів",
    reason:
      "Чим більше кроленят в утробі — тим раніше вони з'являються на світ. Матка переповнена, організм прискорює пологи.",
    action:
      "Маточник встановити вже на 26-й день. Кроленята цілком життєздатні.",
    color: "ok",
  },
  {
    icon: "📏",
    title: "Нормальний послід (5–7 кроленят)",
    timing: "30–32 дні",
    reason: "Стандартний термін для більшості порід середнього розміру.",
    action: "Маточник встановити на 27–28-й день. Нічого особливого не треба.",
    color: "neutral",
  },
  {
    icon: "🏆",
    title: "Малоплідний послід (1–4 кроленяти)",
    timing: "32–35 днів",
    reason:
      "Мало кроленят — матка не переповнена, організм не поспішає. Самка може перехожувати на 2–3 дні понад норму.",
    action:
      "Не панікувати до 35-го дня. Після 35 днів — консультація з ветеринаром.",
    color: "warn",
  },
  {
    icon: "🏗️",
    title: "Велика порода (Фландр, Велет)",
    timing: "31–35 днів",
    reason:
      "Великі породи мають дещо довшу вагітність порівняно з середніми та дрібними.",
    action: "Орієнтуватися на 32–33 дні як норму для великих порід.",
    color: "neutral",
  },
];

const earlyKindlingCauses = [
  {
    cause: "Великий послід (8+ кроленят)",
    risk: "Норма",
    desc: "Природна причина — матка переповнена. Кроленята народжуються на 28–29-й день і зазвичай цілком здорові.",
    action: "Приготувати маточник заздалегідь — з 26-го дня.",
  },
  {
    cause: "Стрес (різкий звук, переляк, транспортування)",
    risk: "Небезпечно до 28 дня",
    desc: "Сильний стрес може викликати передчасні пологи. Кроленята народжені до 27 днів — як правило нежиттєздатні.",
    action:
      "Вагітних самок тримати в тихому місці, не переносити без потреби, не допускати різких звуків.",
  },
  {
    cause: "Хвороба або інтоксикація",
    risk: "Небезпечно",
    desc: "Інфекція або отруєння можуть спровокувати ранній окріл або викидень.",
    action:
      "При будь-яких ознаках хвороби у вагітної самки — негайно до ветеринара.",
  },
  {
    cause: "Недостатнє харчування в останній тиждень",
    risk: "Середній ризик",
    desc: "Дефіцит енергії та поживних речовин перед окролом може вплинути на терміни і виживаність кроленят.",
    action:
      "В останній тиждень вагітності — збільшити порцію концентратів та забезпечити постійний доступ до сіна.",
  },
];

const lateKindlingCauses = [
  {
    cause: "Малоплідний послід (1–4 кроленяти)",
    risk: "Норма до 35 днів",
    desc: "Найчастіша причина. Мало кроленят — матка не переповнена, організм не поспішає запускати пологи.",
    action: "Чекати до 35-го дня. Після — звернутися до ветеринара.",
  },
  {
    cause: "Стрес і несприятливі умови",
    risk: "Вторинна причина",
    desc: "Шум, перегрів, переохолодження, зміна приміщення — все це може затримати пологи.",
    action:
      "Забезпечити спокій, оптимальну температуру (15–20°C), постійний доступ до води.",
  },
  {
    cause: "Вік самки (перший або старший окріл)",
    risk: "Індивідуально",
    desc: "Первородки та старі самки (після 3–4 років) можуть мати нетиповий термін вагітності.",
    action:
      "Вести записи по кожній самці — з часом буде видно індивідуальний патерн.",
  },
  {
    cause: "Помилкова вагітність",
    risk: "Увага",
    desc: "Самка поводиться як вагітна (вищипує вовну, носить сіно), але кроленят немає і не буде. Зазвичай минає само через 16–18 днів від початку ознак.",
    action:
      "Якщо на 35-й день після злучки окролу немає — перевірити пальпацією або УЗД.",
  },
];

const palpationGuide = [
  {
    step: "1",
    title: "Коли робити",
    desc: "На 12–15-й день після злучки. Раніше — зародки ще надто малі, пізніше — ризик нашкодити.",
  },
  {
    step: "2",
    title: "Як зафіксувати самку",
    desc: "Тримати за загривок однією рукою, хвіст спрямований від вас. Самка має стояти на рівній поверхні.",
  },
  {
    step: "3",
    title: "Де промацувати",
    desc: "Вільну руку підвести знизу між задніх лап, в ділянці таза. Подушечками пальців — дуже обережно, без натискання.",
  },
  {
    step: "4",
    title: "Що відчути",
    desc: "У вагітної — дві паралельні нитки м'яких кульок розміром з вишню. При помилковій або порожній матці — нічого не відчувається.",
  },
  {
    step: "5",
    title: "Головне правило",
    desc: "Зайвий тиск неприпустимий — можна травмувати зародки або спровокувати викидень. Краще зробити обережно і нічого не знайти, ніж натиснути.",
  },
];

const OkrilControl = () => {
  const [activeEarly, setActiveEarly] = useState<number | null>(null);
  const [activeLate, setActiveLate] = useState<number | null>(null);

  return (
    <main className="OkrilControl-page">
      <div className="OkrilControl-header">
        <h1>🔍 Контроль дат</h1>
        <p>
          Контрольна злучка, терміни пологів, що робити коли щось іде не так
        </p>
      </div>

      <div className="OkrilControl-wrap">
        {/* ВСТУП */}
        <div className="OkrilControl-intro">
          <h2>Про що ця сторінка — простими словами</h2>
          <p>
            Після злучки кролівник не знає напевно — завагітніла самка чи ні. Ця
            сторінка пояснює як це перевірити через{" "}
            <strong>контрольну злучку</strong>, що означає якщо вона{" "}
            <strong>народжує раніше або пізніше</strong> очікуваного терміну, і
            що робити в кожному з цих випадків.
          </p>
          <div className="OkrilControl-alert ok">
            ✅ Нормальна вагітність кролиці триває <strong>28–35 днів</strong>,
            найчастіше — 30–32 дні. Відлік ведеться від дня злучки.
          </div>
        </div>

        {/* КОНТРОЛЬНА ЗЛУЧКА */}
        <div className="OkrilControl-section-title">
          🔁 Контрольна злучка — навіщо і як
        </div>
        <div className="OkrilControl-block">
          <p className="OkrilControl-block-desc">
            <strong>Контрольна злучка</strong> — це повторне підсаджування самки
            до самця через <strong>5–7 днів</strong> після основної злучки. Мета
            одна — подивитись як вона реагує на самця. Якщо вагітна —
            відганятиме. Якщо ні — підпустить. Це найпростіший і найнадійніший
            спосіб перевірки без пальпації.
          </p>
          <div className="OkrilControl-alert warn">
            ⚠️ <strong>Важливо:</strong> якщо самка вже вагітна, але чомусь
            підпустила самця — не допускати злучки до кінця. Через особливу
            будову матки кролиці (двороговий тип) можливе повторне запліднення в
            другому розі, але таке потомство зазвичай гине. Одразу відсаджуйте.
          </div>

          <div className="OkrilControl-reactions">
            {controlMatingReactions.map((r) => (
              <div
                key={r.reaction}
                className={`OkrilControl-reaction-card OkrilControl-reaction-${r.color}`}
              >
                <div className="OkrilControl-reaction-top">
                  <span className="OkrilControl-reaction-meaning">
                    {r.meaning}
                  </span>
                  <p className="OkrilControl-reaction-desc">{r.reaction}</p>
                </div>
                <div className="OkrilControl-reaction-action">
                  <span>→</span>
                  <p>{r.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ПАЛЬПАЦІЯ */}
        <div className="OkrilControl-section-title">
          👐 Пальпація — перевірка руками на 12–15-й день
        </div>
        <div className="OkrilControl-block">
          <p className="OkrilControl-block-desc">
            Пальпація — це обережне промацування живота самки руками. Дозволяє
            підтвердити вагітність коли контрольна злучка дала неоднозначний
            результат. Потрібна певна навичка, але з досвідом робиться впевнено.
          </p>
          <div className="OkrilControl-steps">
            {palpationGuide.map((s) => (
              <div key={s.step} className="OkrilControl-step">
                <div className="OkrilControl-step-num">{s.step}</div>
                <div>
                  <strong className="OkrilControl-step-title">{s.title}</strong>
                  <p className="OkrilControl-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ЧОМУ НАРОДЖУЄ РАНІШЕ */}
        <div className="OkrilControl-section-title">
          ⚡ Чому народжує раніше очікуваного терміну
        </div>
        <div className="OkrilControl-block">
          <p className="OkrilControl-block-desc">
            Ранній окріл — це пологи до 29-го дня. Причини бувають природні
            (великий послід) або тривожні (стрес, хвороба). Важливо розуміти
            різницю.
          </p>
          <div className="OkrilControl-causes">
            {earlyKindlingCauses.map((c, i) => (
              <div key={c.cause} className="OkrilControl-cause-card">
                <button
                  className="OkrilControl-cause-header"
                  onClick={() => setActiveEarly(activeEarly === i ? null : i)}
                >
                  <div className="OkrilControl-cause-left">
                    <strong>{c.cause}</strong>
                    <span
                      className={`OkrilControl-risk-badge OkrilControl-risk-${
                        c.risk === "Норма"
                          ? "ok"
                          : c.risk.includes("Небезпечно")
                            ? "danger"
                            : "warn"
                      }`}
                    >
                      {c.risk}
                    </span>
                  </div>
                  <span className="OkrilControl-cause-arrow">
                    {activeEarly === i ? "▲" : "▼"}
                  </span>
                </button>
                {activeEarly === i && (
                  <div className="OkrilControl-cause-body">
                    <p>{c.desc}</p>
                    <div className="OkrilControl-cause-action">
                      <span>✅</span>
                      <p>{c.action}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="OkrilControl-alert warn">
            ⚠️ Кроленята народжені до 27-го дня — як правило нежиттєздатні. При
            окролі на 27–28-й день — спробувати підсадити до іншої самки або
            штучне вигодовування.
          </div>
        </div>

        {/* ЧОМУ ПЕРЕТЯГУЄ */}
        <div className="OkrilControl-section-title">
          🐢 Чому перетягує термін і не народжує
        </div>
        <div className="OkrilControl-block">
          <p className="OkrilControl-block-desc">
            Якщо самка не народила на 32-й день — це ще не привід панікувати.
            Але є терміни після яких треба діяти. Нижче — найчастіші причини
            затримки.
          </p>
          <div className="OkrilControl-causes">
            {lateKindlingCauses.map((c, i) => (
              <div key={c.cause} className="OkrilControl-cause-card">
                <button
                  className="OkrilControl-cause-header"
                  onClick={() => setActiveLate(activeLate === i ? null : i)}
                >
                  <div className="OkrilControl-cause-left">
                    <strong>{c.cause}</strong>
                    <span
                      className={`OkrilControl-risk-badge OkrilControl-risk-${
                        c.risk === "Норма до 35 днів"
                          ? "ok"
                          : c.risk === "Увага"
                            ? "danger"
                            : "warn"
                      }`}
                    >
                      {c.risk}
                    </span>
                  </div>
                  <span className="OkrilControl-cause-arrow">
                    {activeLate === i ? "▲" : "▼"}
                  </span>
                </button>
                {activeLate === i && (
                  <div className="OkrilControl-cause-body">
                    <p>{c.desc}</p>
                    <div className="OkrilControl-cause-action">
                      <span>✅</span>
                      <p>{c.action}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="OkrilControl-alert danger">
            🚨 Якщо на <strong>35-й день</strong> після злучки самка так і не
            народила — обов'язково зверніться до ветеринара. Затяжна вагітність
            підвищує ризик мертвонароджених або ускладнень при пологах.
          </div>
        </div>

        {/* ТЕРМІНИ ЗА СИТУАЦІЄЮ */}
        <div className="OkrilControl-section-title">
          📅 Очікуваний термін залежно від ситуації
        </div>
        <div className="OkrilControl-gestation-grid">
          {gestationVariants.map((g) => (
            <div
              key={g.title}
              className={`OkrilControl-gestation-card OkrilControl-gestation-${g.color}`}
            >
              <div className="OkrilControl-gestation-top">
                <span className="OkrilControl-gestation-icon">{g.icon}</span>
                <div>
                  <strong className="OkrilControl-gestation-title">
                    {g.title}
                  </strong>
                  <span className="OkrilControl-gestation-timing">
                    {g.timing}
                  </span>
                </div>
              </div>
              <p className="OkrilControl-gestation-reason">{g.reason}</p>
              <div className="OkrilControl-gestation-action">→ {g.action}</div>
            </div>
          ))}
        </div>

        <div className="OkrilControl-back">
          <Link to="/" className="OkrilControl-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default OkrilControl;
