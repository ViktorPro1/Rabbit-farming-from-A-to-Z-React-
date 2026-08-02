import { useState } from "react";
import { Link } from "react-router-dom";
import "./ColorGeneticsExample.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { breeds } from "../../data/breeds";
import {
  BREED_COLOR_DATA,
  calculateOffspring,
  type DataStatus,
} from "./breedColorGenetics";

const loci = [
  {
    locus: "A",
    name: "Агуті",
    alleles: "A > aᵗ > a",
    desc: "Малюнок волосини: агуті (дика розцвітка), тан (підпал) чи суцільний колір",
  },
  {
    locus: "B",
    name: "Базовий колір",
    alleles: "B > b",
    desc: "Чорний (B) проти шоколадного (b)",
  },
  {
    locus: "C",
    name: "Інтенсивність",
    alleles: "C > cchd > cchl > ch > c",
    desc: "Повний колір → шиншила → соболь → гімалайський малюнок → альбінос",
  },
  {
    locus: "D",
    name: "Дилюція",
    alleles: "D > d",
    desc: "Насичений колір (D) проти розведеного — блакитний/лілововий (d)",
  },
  {
    locus: "E",
    name: "Розповсюдження",
    alleles: "E > eʲ > e",
    desc: "Нормальне розповсюдження пігменту проти освітлених ділянок",
  },
];

const punnettResult = [
  { genotype: "B_D_ (9/16)", phenotype: "Чорний", share: "56,25%" },
  { genotype: "B_dd (3/16)", phenotype: "Блакитний", share: "18,75%" },
  { genotype: "bbD_ (3/16)", phenotype: "Шоколадний", share: "18,75%" },
  { genotype: "bbdd (1/16)", phenotype: "Лілововий", share: "6,25%" },
];

const TERM_GLOSSARY: { term: string; explanation: string }[] = [
  {
    term: "Агуті",
    explanation:
      "Не окремий колір, а малюнок волосини: шерстинка має кілька зон різного кольору (темний кінчик, світла смужка, темна основа) — як у дикого зайця. Виглядає як переливчастий, 'заячий' окрас, а не суцільний.",
  },
  {
    term: "Суцільний (self)",
    explanation:
      "Волосина однотонна від кореня до кінчика, без переливів і смужок.",
  },
  {
    term: "Тан / підпал (at)",
    explanation:
      "Тіло темне, але живіт, боки морди, навколо очей і під хвостом — світлі, різко контрастні ділянки (як у добермана).",
  },
  {
    term: "Дилюція (D/d)",
    explanation:
      "'Розведення' насиченості пігменту: чорний → блакитний, шоколадний → лілововий. Колір той самий за типом, але світліший і з сіруватим відтінком.",
  },
  {
    term: "Гімалайський малюнок (ch)",
    explanation:
      "Тіло майже повністю біле, а кольорові мітки лишаються тільки на найхолодніших ділянках — ніс, вуха, лапи, хвіст (як у сіамського кота).",
  },
  {
    term: "Шиншиловий відтінок (cchd)",
    explanation:
      "Прибирає жовтий/рудий підтон із агуті-смужки, лишаючи сіро-перлинний, 'посріблений' вигляд замість природного рудуватого.",
  },
  {
    term: "Соболиний відтінок (cchl)",
    explanation:
      "Пігмент слабшає до світло-коричневого на більшій частині тіла, темнішаючи на 'точках' (вуха, морда, лапи) — м'якший перехід, ніж у гімалайського малюнку.",
  },
  {
    term: "Альбінос (c)",
    explanation:
      "Повна відсутність пігменту: біла шерсть, червоні (насправді безбарвні, просвічують судини) очі. Маскує всі інші гени кольору.",
  },
  {
    term: "Нон-екстеншн (e)",
    explanation:
      "Чорний/коричневий пігмент у шерсті не виробляється взагалі — лишається тільки рудий/жовтий пігмент. Тварина виглядає рудою чи кремовою навіть якщо генетично мала бути чорною.",
  },
  {
    term: "Арлекін / японський (ej)",
    explanation:
      "Пігмент розподіляється нерівномірно плямами чи смугами по тілу — контрастне чергування ділянок різного кольору.",
  },
];

const STATUS_LABEL: Record<DataStatus, { label: string; className: string }> = {
  confident: { label: "Дані перевірені", className: "colorcalc-badge ok" },
  approximate: { label: "Орієнтовні дані", className: "colorcalc-badge warn" },
  multicolor: {
    label: "Багатоколірна порода",
    className: "colorcalc-badge info",
  },
  unknown: { label: "Потребує уточнення", className: "colorcalc-badge danger" },
};

const ColorGeneticsExample = () => {
  const [breedMode, setBreedMode] = useState<"standard" | "cross">("standard");
  const [breedIdA, setBreedIdA] = useState<string>(breeds[0]?.id ?? "");
  const [breedIdB, setBreedIdB] = useState<string>(
    breeds[1]?.id ?? breeds[0]?.id ?? "",
  );

  const infoA = BREED_COLOR_DATA[breedIdA];
  const infoB = BREED_COLOR_DATA[breedIdB];
  const breedNameA = breeds.find((b) => b.id === breedIdA)?.name ?? breedIdA;
  const breedNameB = breeds.find((b) => b.id === breedIdB)?.name ?? breedIdB;

  const canCross =
    infoA &&
    infoB &&
    (infoA.dataStatus === "confident" || infoA.dataStatus === "approximate") &&
    (infoB.dataStatus === "confident" || infoB.dataStatus === "approximate") &&
    infoA.genotype &&
    infoB.genotype;

  const crossResult = canCross
    ? calculateOffspring(infoA.genotype!, infoB.genotype!)
    : null;

  return (
    <main className="colorcalc-page">
      <div className="colorcalc-header">
        <h1>🧮 Практичний калькулятор кольору кроля</h1>
        <p>
          Покроковий приклад: від генотипів батьків до реальної ймовірності
          забарвлення в потомстві
        </p>
      </div>

      <div className="colorcalc-wrap">
        <div className="colorcalc-intro">
          <h2>Навіщо це заводчику</h2>
          <p>
            Сторінка "Генетика забарвлення" пояснює локуси й алелі описово. Тут
            — конкретний робочий приклад: як від генотипів двох конкретних
            батьків порахувати, яке забарвлення й з якою ймовірністю з'явиться в
            потомстві. Це рятує від сюрпризів у вигляді "нестандартного"
            забарвлення в посліді та допомагає свідомо планувати паровання під
            бажаний колір.
          </p>
          <div className="colorcalc-alert ok">
            ✅ Головний принцип: кожен локус успадковується незалежно від інших
            (спрощено). Спочатку рахуємо ймовірність окремо для кожного локусу,
            а потім перемножуємо результати між собою.
          </div>
        </div>

        <div className="colorcalc-section-title">🧬 П'ять основних локусів</div>
        <div className="colorcalc-table-wrap">
          <table className="colorcalc-table">
            <thead>
              <tr>
                <th>Локус</th>
                <th>За що відповідає</th>
                <th>Ієрархія алелів</th>
                <th>Пояснення</th>
              </tr>
            </thead>
            <tbody>
              {loci.map((l) => (
                <tr key={l.locus}>
                  <td>
                    <strong>{l.locus}</strong>
                  </td>
                  <td>{l.name}</td>
                  <td className="colorcalc-value">{l.alleles}</td>
                  <td>{l.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="colorcalc-section-title">
          📐 Робочий приклад: розрахунок за одним локусом
        </div>
        <div className="colorcalc-note">
          <p>
            Візьмемо локус B (базовий колір). Припустимо, обидва батьки — носії:
            генотип <strong>Bb</strong> (зовні чорні, але кожен несе приховану
            чоколадну алель). Складаємо решітку Пеннета 2×2:
          </p>
          <ul>
            <li>BB — 1 з 4 (25%) — чорний</li>
            <li>Bb — 2 з 4 (50%) — чорний (B домінує над b)</li>
            <li>bb — 1 з 4 (25%) — шоколадний</li>
          </ul>
          <p>
            Підсумок: 75% потомства матиме чорний колір за цим локусом (B_), 25%
            — шоколадний (bb) — навіть якщо жоден з батьків зовні не був
            шоколадним.
          </p>
        </div>

        <div className="colorcalc-section-title">
          🔢 Повний приклад: два локуси одночасно
        </div>
        <div className="colorcalc-note">
          <p>
            Тепер ускладнимо: обидва батьки мають генотип <strong>Bb Dd</strong>{" "}
            (носії і шоколадної, і дилютної алелей, зовні — звичайні чорні
            кролики). Рахуємо кожен локус окремо, потім перемножуємо
            ймовірності:
          </p>
          <ul>
            <li>За локусом B: 75% B_ (чорна база) : 25% bb (шоколадна база)</li>
            <li>За локусом D: 75% D_ (насичений) : 25% dd (дилютний)</li>
          </ul>
        </div>
        <div className="colorcalc-table-wrap">
          <table className="colorcalc-table">
            <thead>
              <tr>
                <th>Комбінація генотипів</th>
                <th>Фенотип (колір)</th>
                <th>Ймовірність</th>
              </tr>
            </thead>
            <tbody>
              {punnettResult.map((p) => (
                <tr key={p.genotype}>
                  <td>{p.genotype}</td>
                  <td>
                    <strong>{p.phenotype}</strong>
                  </td>
                  <td className="colorcalc-value">{p.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="colorcalc-alert warn">
          ⚠️ Логіка розрахунку: 75% × 75% = 56,25% (чорний), 75% × 25% = 18,75%
          (блакитний), 25% × 75% = 18,75% (шоколадний), 25% × 25% = 6,25%
          (лілововий). Це і є "правило множення" незалежних локусів — принцип,
          застосовний до будь-якої пари генів з відомими генотипами батьків.
        </div>

        <div className="colorcalc-section-title">
          🧩 Як застосувати до своїх кролів
        </div>
        <div className="colorcalc-note">
          <ol>
            <li>Визначте видимий фенотип (колір) обох батьків</li>
            <li>
              За родоводом чи попереднім потомством спробуйте встановити,
              носіями яких прихованих алелей вони можуть бути (наприклад, якщо
              від двох чорних батьків вже народжувався шоколадний кроленя —
              обидва точно Bb)
            </li>
            <li>
              Порахуйте ймовірність окремо для кожного цікавого вам локусу
            </li>
            <li>Перемножте ймовірності між локусами для повної картини</li>
          </ol>
          <p>
            Для трьох і більше локусів одночасно решітка Пеннета стає громіздкою
            (8×8 і більше) — на практиці простіше рахувати кожен локус окремо у
            вигляді відсотка й перемножувати підсумкові числа, як у прикладі
            вище.
          </p>
        </div>

        <div className="colorcalc-section-title">
          🐇 Калькулятор окрасу за породою
        </div>
        <div className="colorcalc-note">
          <p>
            Не знаєте точний генотип своїх кролів? Оберіть породу — і побачите
            визнані стандартом окраси, або оберіть дві породи для орієнтовного
            прогнозу окрасу кроленят при схрещуванні.
          </p>
        </div>

        <div className="breedcalc-tabs">
          <button
            className={`breedcalc-tab ${breedMode === "standard" ? "active" : ""}`}
            onClick={() => setBreedMode("standard")}
          >
            Стандартний окрас породи
          </button>
          <button
            className={`breedcalc-tab ${breedMode === "cross" ? "active" : ""}`}
            onClick={() => setBreedMode("cross")}
          >
            Схрещування двох порід
          </button>
        </div>

        {breedMode === "standard" && (
          <>
            <div className="breedcalc-select-row">
              <label className="breedcalc-label">
                Порода
                <select
                  id="breedcalc-standard-breed"
                  name="breedcalc-standard-breed"
                  value={breedIdA}
                  onChange={(e) => setBreedIdA(e.target.value)}
                >
                  {breeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {infoA ? (
              <div className="colorcalc-note">
                <span className={STATUS_LABEL[infoA.dataStatus].className}>
                  {STATUS_LABEL[infoA.dataStatus].label}
                </span>
                <h3 style={{ marginTop: "12px" }}>
                  Визнані окраси: {breedNameA}
                </h3>
                <ul>
                  {infoA.standardColors.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                {infoA.note && (
                  <p className="colorcalc-disclaimer">ℹ️ {infoA.note}</p>
                )}
              </div>
            ) : (
              <div className="colorcalc-alert warn">
                Дані для цієї породи ще не додані.
              </div>
            )}
          </>
        )}

        {breedMode === "cross" && (
          <>
            <div className="breedcalc-select-row two">
              <label className="breedcalc-label">
                Батько / мати №1
                <select
                  id="breedcalc-cross-parent-a"
                  name="breedcalc-cross-parent-a"
                  value={breedIdA}
                  onChange={(e) => setBreedIdA(e.target.value)}
                >
                  {breeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="breedcalc-label">
                Батько / мати №2
                <select
                  id="breedcalc-cross-parent-b"
                  name="breedcalc-cross-parent-b"
                  value={breedIdB}
                  onChange={(e) => setBreedIdB(e.target.value)}
                >
                  {breeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {!canCross && (
              <div className="colorcalc-alert warn">
                ⚠️ Для однієї або обох обраних порід ще немає достатньо надійних
                даних про генотип (породи зі статусом «Багатоколірна» або
                «Потребує уточнення» не беруть участі в розрахунку — дивіться
                список визнаних окрасів у вкладці «Стандартний окрас породи»).
              </div>
            )}

            {canCross && crossResult && (
              <>
                <div className="colorcalc-note">
                  <p>
                    Розрахунок виконано у припущенні, що обидві породи —
                    чистопородні лінії, гомозиготні за типовим для породи
                    генотипом. Реальні тварини можуть бути носіями прихованих
                    (рецесивних) алелей — точний результат гарантує лише
                    ДНК-тест або відомий родовід.
                  </p>
                </div>
                <div className="colorcalc-table-wrap">
                  <table className="colorcalc-table">
                    <thead>
                      <tr>
                        <th>Схрещування</th>
                        <th>Очікуваний окрас F1</th>
                        <th>Ймовірність</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crossResult.map((r) => (
                        <tr key={r.phenotype}>
                          <td>
                            {breedNameA} × {breedNameB}
                          </td>
                          <td>
                            <strong>{r.phenotype}</strong>
                          </td>
                          <td className="colorcalc-value">
                            {Math.round(r.probability * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}

        <details className="colorcalc-note colorcalc-glossary">
          <summary>❓ Що означають ці терміни (агуті, тан, дилюція...)</summary>
          <dl>
            {TERM_GLOSSARY.map((t) => (
              <div className="colorcalc-glossary-item" key={t.term}>
                <dt>{t.term}</dt>
                <dd>{t.explanation}</dd>
              </div>
            ))}
          </dl>
        </details>

        <div className="colorcalc-note colorcalc-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Oregon State University Extension Service — Rabbit Coat Color
              Genetics, Part 1–2
            </li>
            <li>
              Omni Calculator — Rabbit Color Calculator (методика розрахунку)
            </li>
          </ul>
          <p className="colorcalc-disclaimer">
            Матеріал має ознайомчий характер. Реальні генотипи конкретних тварин
            без родоводу чи генетичного тесту можна лише припускати за
            спостереженнями з попередніх посліду. Генотипи по породах —
            узагальнена оцінка, а не звірені дані конкретного клубу/стандарту.
          </p>
        </div>

        <div className="colorcalc-related">
          <h3 className="colorcalc-related-title">Читайте також</h3>
          <div className="colorcalc-related-grid">
            <Link to="/genetics" className="colorcalc-related-link">
              🎨 Генетика забарвлення
            </Link>
            <Link to="/lethal-color-genes" className="colorcalc-related-link">
              ⚠️ Небезпечні поєднання генів
            </Link>
            <Link
              to="/coat-colors-evaluation"
              className="colorcalc-related-link"
            >
              🎨 Оцінка забарвлення
            </Link>
            <Link to="/dna-testing" className="colorcalc-related-link">
              🔬 ДНК-тест
            </Link>
          </div>
        </div>

        <div className="colorcalc-back">
          <Link to="/" className="colorcalc-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Практичний калькулятор кольору кроля" />
        </div>
      </div>
    </main>
  );
};

export default ColorGeneticsExample;
