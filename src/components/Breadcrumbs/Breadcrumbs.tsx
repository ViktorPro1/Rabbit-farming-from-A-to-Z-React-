import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";
import { groups } from "../../data/sectionCards";

// ── Path -> назва розділу (для середньої хлібної крихти) ────────
const PATH_TO_SECTION: Record<string, string> = {};
groups.forEach((g) => {
  g.cards.forEach((c) => {
    if (!c.external) {
      PATH_TO_SECTION[c.path] = g.groupTitle;
    }
  });
});

// ── Route label map ──────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  "/": "Головна",

  // З ЧОГО ПОЧАТИ
  "/beginner-guide": "Маршрут новачка",
  "/buying-rabbit": "Купівля кроля",
  "/faq": "Часті запитання",
  "/beginner-mistakes": "Типові помилки",
  "/rabbit-myths": "Міфи про кролів",
  "/glossary": "Словник",
  "/rabbit-allergy": "Алергія на кролів у людей",

  // ЗАГАЛЬНЕ
  "/subscription": "Підписка",
  "/community": "Спільнота",
  "/auth": "Вхід",

  // ПОЧАТОК — знайомство з твариною
  "/biology": "Біологія та анатомія",
  "/breeds": "Породи",
  "/breeding": "Схрещування",
  "/artificial-insemination": "Штучне осіменіння",
  "/selection": "Селекція",
  "/genetics": "Генетика забарвлення",
  "/rabbit-whiskers": "Вуса (вібриси)",

  // ПОРІВНЯННЯ ТА СПІВЖИТТЯ
  "/rabbit-vs-hare": "Кролик vs Заєць",
  "/rabbits-and-guinea-pigs": "Кролі та морські свинки",
  "/rabbits-and-predators": "Кролі, коти та собаки",
  "/rabbits-and-chickens": "Кролі та кури",
  "/rabbits-and-children": "Кролі та діти",

  // ЖИТЛО
  "/enclosure": "Клітки",
  "/floor-care": "Підлогове утримання",
  "/pit-keeping": "Ямове утримання",
  "/microclimate": "Мікроклімат",
  "/rabbit-housing-diy": "Клітки своїми руками",

  // ПОВЕДІНКА ТА ПСИХОЛОГІЯ
  "/rabbit-sounds": "Звуки кролів",
  "/rabbit-behavior-problems": "Проблемна поведінка",
  "/rabbit-body-language": "Мова тіла кроля",
  "/rabbit-stress": "Стрес та переляк",
  "/group-housing": "Групове утримання та ієрархія",

  // ХАРЧУВАННЯ
  "/feeding": "Годування",
  "/leaves": "Листя та гілки",
  "/crops": "Кормові культури",
  "/water": "Водопостачання",
  "/feeders": "Годівниці та сінники",
  "/new-food": "Введення нового корму",
  "/compound-feed": "Комбікорм",
  "/special-feeds": "Соковиті корми",

  // ДОГЛЯД
  "/care": "Догляд",
  "/disinfection": "Дезінфекція",
  "/biosecurity": "Біобезпека",
  "/grooming": "Кігті та зуби",
  "/seasonal-molting": "Линька: норма та патологія",
  "/predators": "Хижаки та шкідники",

  // РОЗВЕДЕННЯ
  "/okril": "Окріл",
  "/winter-litter": "Зимовий окріл",
  "/weaning": "Відлучення та дорощування",
  "/weight-control": "Контроль ваги",
  "/artificial-feeding": "Штучне вигодовування",
  "/mating-frequency": "Частота злучування",
  "/mating-behavior": "Поведінка при злучці",
  "/okril-control": "Контроль дат",
  "/sexing": "Визначення статі",
  "/doe-preparation": "Підготовка самки до злучки",
  "/buck-management": "Утримання плідника",
  "/false-pregnancy": "Хибна вагітність",
  "/telegony": "Телегонія",

  // ЗДОРОВ'Я
  "/vaccinations": "Вакцинація",
  "/parasites": "Паразити",
  "/diseases": "Хвороби",
  "/medicines": "Препарати",
  "/treatment": "Схеми лікування",
  "/first-aid": "Перша допомога",
  "/heat-stroke": "Спека",
  "/lab-diagnostics": "Лаб. діагностика",
  "/symptoms": "Симптоматичний пошук",
  "/necropsy": "Некропсія",
  "/drug-compatibility": "Сумісність препаратів",
  "/pain-management": "Знеболення",
  "/neutering": "Кастрація та стерилізація",
  "/water-medication": "Пропойка",
  "/droppings": "Послід",
  "/zoonoses": "Зонози",
  "/rabbit-body-condition": "Кондиція тіла (BCS)",
  "/dosage-calculator": "Калькулятор дозування",
  "/poisoning": "Отруєння кролів",
  "/diet-therapy": "Дієтична терапія",
  "/anesthesia-care": "Анестезія та догляд",
  "/treatment-log": "Журнал лікувань",
  "/antibiotic-therapy": "Антибіотикотерапія",

  // ВЕТЕРИНАРНІ МАНІПУЛЯЦІЇ
  "/vet-injections": "Ін'єкції",
  "/vet-oral-meds": "Таблетки та суспензії",
  "/vet-temperature": "Вимірювання температури",
  "/vet-fecal-sample": "Збір калу на аналіз",

  // СЕЗОННІ ЗАГРОЗИ
  "/seasonal-spring": "Весна: кокцидіоз",
  "/seasonal-summer": "Літо: міаз",
  "/seasonal-autumn": "Осінь: підготовка до зими",

  // ПЛАНУВАННЯ
  "/calendar": "Сезонний календар",
  "/tips": "Поради",
  "/breeding-herd": "Маточне поголів'я",

  // ІНСТРУМЕНТИ
  "/calculator": "Калькулятор",
  "/equipment": "Обладнання",
  "/tools": "Інструменти",

  // ФІНАЛ
  "/slaughter": "Забій та переробка",
  "/fur-processing": "Шкура та пух",
  "/culling": "Вибраковка",
  "/transport": "Транспортування",
  "/recipes": "Рецепти",

  // ПЛЕМІННА СПАВА ТА ВИСТАВКА
  "/breed-standards": "Стандарти порід",
  "/show-preparation": "Підготовка до виставки",
  "/show-judging": "Суддівство на виставці",
  "/breeding-evaluation": "Племінна оцінка",
  "/coat-colors-evaluation": "Оцінка забарвлення",
  "/rabbit-conformation": "Екстер'єр кроля",
  "/fur-evaluation": "Оцінка хутра",
  "/replacement-stock": "Відбір ремонтного молодняку",
  "/select-buck": "Вибір племінного самця",
  "/select-doe": "Вибір племінної самки",
  "/disqualifying-faults": "Дискваліфікаційні вади",
  "/pedigree-records": "Родоводи та племінний облік",
  "/show-scoring": "Система оцінювання",

  // УПРАВЛІННЯ
  "/economics": "Економіка",
  "/legal": "Юридичний куточок",
  "/sales": "Збут",
  "/profit-calculator": "Калькулятор рентабельності",
  "/composting": "Переробка гною",
  "/insurance-grants": "Страхування та грантова підтримка ОСГ",

  // ТЕХНОЛОГІЇ ТА АВТОМАТИЗАЦІЯ
  "/feeding-automation": "Автоматизація годівлі та напування",
  "/climate-automation": "Автоматичний контроль мікроклімату",
  "/farm-management-software": "Програми обліку господарства",
  "/farm-monitoring": "Відеоспостереження та моніторинг",
  "/smart-farm": "Смарт-ферма: інтеграція систем",

  // КРОЛИК ЯК ДОМАШНІЙ УЛЮБЛЕНЕЦЬ
  "/apartment-proofing": "Кролик-пруфінг квартири",
  "/litter-training": "Привчання до лотка",
  "/enrichment": "Збагачення середовища",
  "/companion-bonding": "Один чи два кролики",
  "/pet-travel": "Кролик у подорожі",
  "/senior-rabbit": "Кролик похилого віку",

  // ОСОБИСТИЙ КАБІНЕТ
  "/registry": "Реєстр",
  "/registry/edit": "Редагування",
  "/archive": "Архів",
  "/matings": "Парування",
  "/paddocks": "Загони",
  "/fattening": "Відгодівля",
  "/quarantine": "Карантин",
  "/statistics": "Статистика",
  "/my-vaccinations": "Мої щеплення",
  "/my-treatments": "Мої лікування",
  "/cage-search": "Історія клітки",
  "/disinfection-log": "Дезінфекція",
  "/grain-recipes-history": "Раціони",

  // АДМІН
  "/admin": "Адмін",

  // ОНОВЛЕННЯ
  "/changelog": "Оновлення",

  // ІНФОРМАЦІЯ
  "/about": "Про проєкт",
  "/privacy-policy": "Політика конфіденційності",
  "/terms-of-use": "Умови використання",
};

// ── Separator ────────────────────────────────────────────────────
function Sep() {
  return (
    <span className="breadcrumbs__sep" aria-hidden="true">
      ❧
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────
export default function Breadcrumbs() {
  const { pathname } = useLocation();

  // Не показуємо на головній
  if (pathname === "/") return null;

  const parts = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; path: string | null }[] = [
    { label: "Головна", path: "/" },
  ];

  // Вставляємо назву розділу — клікабельна, веде на головну і розгортає групу
  const sectionTitle = PATH_TO_SECTION[pathname];
  if (sectionTitle && parts.length === 1) {
    crumbs.push({
      label: sectionTitle,
      path: `/#section-${encodeURIComponent(sectionTitle)}`,
    });
  }

  parts.forEach((segment, idx) => {
    // Пропускаємо числові id та UUID (динамічні сегменти /rabbit/:id тощо)
    if (/^\d+$/.test(segment) || /^[0-9a-f-]{36}$/i.test(segment)) return;

    const path = "/" + parts.slice(0, idx + 1).join("/");
    const label = ROUTE_LABELS[path] ?? segment;
    crumbs.push({ label, path });
  });

  return (
    <nav className="breadcrumbs" aria-label="Хлібні крихти">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <span key={crumb.label + idx} className="breadcrumbs__item">
            {idx > 0 && <Sep />}
            {isLast ? (
              <span className="breadcrumbs__current" aria-current="page">
                {crumb.label}
              </span>
            ) : crumb.path ? (
              <Link to={crumb.path} className="breadcrumbs__link">
                {crumb.label}
              </Link>
            ) : (
              <span className="breadcrumbs__section">{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
