import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "🐰 Утримання",
    items: [
      { label: "🧬 Родовід", path: "/pedigree" },
      { label: "💞 Парування", path: "/matings" },
      { label: "🏠 Вольєр", path: "/paddocks" },
      { label: "📅 Календар", path: "/my-calendar" },
    ],
  },
  {
    title: "🩺 Здоров'я",
    items: [
      { label: "🔒 Карантин", path: "/quarantine" },
      { label: "💊 Лікування", path: "/my-treatments" },
      { label: "💉 Вакцинація", path: "/my-vaccinations" },
      { label: "🧴 Дезінфекція", path: "/disinfection-log" },
      { label: "🧰 Аптечка", path: "/aptechka" },
    ],
  },
  {
    title: "📈 Ріст і вихід",
    items: [
      { label: "⚖️ Зважування", path: "/weighing" },
      { label: "🥩 Відгодівля", path: "/fattening" },
      { label: "🧾 Раціони", path: "/grain-recipes-history" },
      { label: "🌾 Корми", path: "/feed-stock" },
    ],
  },
  {
    title: "🧮 Вартість й аналітика",
    items: [
      { label: "💰 Фінанси", path: "/finances" },
      // Перехід на сторінку «Аналіз собівартості»
      { label: "🏷️ Собівартість", path: "/cost-analysis" },
      { label: "📉 Статистика", path: "/statistics" },
      { label: "🔍 Історія клітки", path: "/cage-search" },
    ],
  },
];

interface Props {
  onOpenQr: () => void;
  onOpenHelp: () => void;
  onExport: () => void;
  exporting: boolean;
  exportError: string;
}

export default function NavPanel({
  onOpenQr,
  onOpenHelp,
  onExport,
  exporting,
  exportError,
}: Props) {
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <button
        className="registry-nav-toggle"
        onClick={() => setShowNav(!showNav)}
      >
        📊 Панель кролівництва
        <span className={`registry-nav-arrow ${showNav ? "open" : ""}`}>
          ▼
        </span>
      </button>

      <div className={`registry-header-nav-wrap ${showNav ? "open" : ""}`}>
        <div className="registry-header-nav">
          {navSections.map((section) => (
            <div key={section.title} className="nav-section">
              <div className="nav-section-title">{section.title}</div>
              <div className="nav-section-grid">
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    className="registry-archive-link"
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="nav-section">
            <div className="nav-section-title">⚙️ Сервіс</div>
            <div className="nav-section-grid">
              <button
                className="registry-archive-link"
                onClick={() => navigate("/archive")}
              >
                📦 Архів
              </button>
              <button
                className="registry-archive-link qr-nav-btn"
                onClick={onOpenQr}
              >
                📷 QR-коди
              </button>
              <button
                className="registry-archive-link"
                onClick={onExport}
                disabled={exporting}
              >
                📥 {exporting ? "Формую файл..." : "Експорт CSV"}
              </button>
              {exportError && <p className="registry-error">{exportError}</p>}
              <button className="registry-help-btn" onClick={onOpenHelp}>
                ? Довідка
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
