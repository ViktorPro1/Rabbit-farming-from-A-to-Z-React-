import { useState } from "react";
import { Link } from "react-router-dom";
import "./Medicines.css";
import { medicines } from "./medicines.data";
import type { Category } from "./medicines.types";
import DoseCalculator from "./DoseCalculator";
import ShareButton from "../../components/ShareButton/ShareButton";

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "injection", label: "💉 Ін'єкції" },
  { value: "antiparasitic", label: "Антипаразитарні" },
  { value: "antibiotic", label: "Антибіотики" },
  { value: "iodine", label: "Йод" },
  { value: "vitamins", label: "Вітаміни" },
  { value: "external", label: "Зовнішні" },
  { value: "gi", label: "ШКТ" },
];

const Medicines = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = medicines.filter((m) => {
    const matchCat = activeCategory === "all" || m.category === activeCategory;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="med-page">
      <div className="med-header">
        <h1>&#128138; Ветеринарні препарати для кроликів</h1>
        <p>Таблетки, порошки, мазі та ін'єкції — повний довідник</p>
      </div>

      <div className="med-wrap">
        <div className="med-notice">
          &#9888;&#65039; Інформація довідкова. Перед застосуванням —
          консультація ветеринара обов'язкова.
        </div>

        <div className="med-search-row">
          <input
            id="med-search"
            name="med-search"
            className="med-search"
            type="text"
            placeholder="&#128269; Пошук препарату..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="med-cats">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`med-cat-btn${activeCategory === c.value ? " active" : ""}`}
              onClick={() => setActiveCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="med-list">
          {filtered.length === 0 && (
            <p className="med-empty">
              Нічого не знайдено. Спробуйте інший запит.
            </p>
          )}
          {filtered.map((m) => (
            <div
              key={m.name}
              className={`med-card${expanded === m.name ? " open" : ""}${m.category === "injection" ? " injection" : ""}`}
              onClick={() => setExpanded(expanded === m.name ? null : m.name)}
            >
              <div className="med-card-top">
                <span className="med-card-icon">{m.icon}</span>
                <div className="med-card-info">
                  <div className="med-card-name">{m.name}</div>
                  <div className="med-card-desc">{m.description}</div>
                </div>
                <span className="med-chevron">
                  {expanded === m.name ? "&#9650;" : "&#9660;"}
                </span>
              </div>

              {expanded === m.name && (
                <div className="med-card-body">
                  {m.whatIsIt && (
                    <div className="med-what-is-it">
                      <span className="med-what-label">
                        &#128161; Що це і від чого
                      </span>
                      <p>{m.whatIsIt}</p>
                    </div>
                  )}
                  {m.symptoms && (
                    <div className="med-row">
                      <span className="med-row-label">&#128269; Симптоми</span>
                      <span>{m.symptoms}</span>
                    </div>
                  )}
                  <div className="med-row">
                    <span className="med-row-label">Застосування</span>
                    <span>{m.usage}</span>
                  </div>
                  {m.dosagePrevention && (
                    <div className="med-row dose-prev">
                      <span className="med-row-label">
                        &#128737; Доза — профілактика
                      </span>
                      <span>{m.dosagePrevention}</span>
                    </div>
                  )}
                  {m.dosageTreatment && (
                    <div className="med-row dose-treat">
                      <span className="med-row-label">
                        &#128138; Доза — лікування
                      </span>
                      <span>{m.dosageTreatment}</span>
                    </div>
                  )}
                  {m.dosage && (
                    <div className="med-row">
                      <span className="med-row-label">Дозування</span>
                      <span>{m.dosage}</span>
                    </div>
                  )}
                  <div className="med-row">
                    <span className="med-row-label">Курс</span>
                    <span>{m.course}</span>
                  </div>
                  {m.injectionSite && (
                    <div className="med-row">
                      <span className="med-row-label">
                        &#128205; Місце введення
                      </span>
                      <span>{m.injectionSite}</span>
                    </div>
                  )}
                  {m.preparation && (
                    <div className="med-row">
                      <span className="med-row-label">
                        &#128295; Підготовка
                      </span>
                      <span>{m.preparation}</span>
                    </div>
                  )}
                  {m.warning && (
                    <div className="med-warning">
                      &#9888;&#65039; {m.warning}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="med-injection-tip">
          <div className="med-tip-title">
            &#128137; Техніка ін'єкцій кроликам
          </div>
          <div className="med-tip-grid">
            <div className="med-tip-card">
              <div className="med-tip-name">Підшкірно (п/ш)</div>
              <p>
                Холка — складка шкіри між лопатками. Зібрати шкіру в трикутник,
                голку вводити в основу складки під кутом 45°. Перед введенням
                злегка потягнути поршень — якщо немає крові, можна вводити.
              </p>
            </div>
            <div className="med-tip-card">
              <div className="med-tip-name">Внутрішньом'язово (в/м)</div>
              <p>
                Стегно задньої лапи — середина м'яза. Голку вводити
                перпендикулярно під кутом 90°, глибина 1–1,5 см. Чергувати ліву
                і праву лапу. Не колоти двічі в одне місце.
              </p>
            </div>
            <div className="med-tip-card">
              <div className="med-tip-name">Внутрішньовенно (в/в)</div>
              <p>
                Вена з внутрішньої сторони вушної раковини. Використовується
                рідко, лише у важких випадках. Рекомендується лише досвідченим
                або ветеринару.
              </p>
            </div>
          </div>
        </div>

        <DoseCalculator />

        <div className="med-back">
          <Link to="/" className="med-back-btn">
            &#11013; На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default Medicines;
