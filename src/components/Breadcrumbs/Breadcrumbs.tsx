import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";
import { PATH_TO_SECTION } from "../../data/navMap.generated";

// ── Route label map ──────────────────────────────────────────────
const ROUTE_LABELS: Record<string, string> = {
  "/": "Головна",
  "/rabbit": "Картка кролика",
  "/fattening-public": "Картка відгодівлі",

  // З ЧОГО ПОЧАТИ
  "/beginner-guide": "Маршрут новачка",
  "/buying-rabbit": "Купівля кроля",
  "/faq": "Часті запитання",
  "/beginner-mistakes": "Типові помилки",
  "/rabbit-myths": "Міфи про кролів",
  "/glossary": "Словник",
  "/rabbit-allergy": "Алергія на кролів у людей",
  "/rabbit-handling": "На руках",

  // ЗАГАЛЬНЕ
  "/subscription": "Підписка",
  "/community": "Спільнота",
  "/auth": "Вхід",
  "/partnership": "Партнерство",
  "/reviews": "Відгуки",

  // ПОЧАТОК — знайомство з твариною
  "/biology": "Біологія та анатомія",
  "/breeds": "Породи",
  "/breeding": "Схрещування",
  "/artificial-insemination": "Штучне осіменіння",
  "/selection": "Селекція",
  "/genetics": "Генетика забарвлення",
  "/rabbit-whiskers": "Вуса (вібриси)",
  "/history": "Історія обліку",
  "/color-genetics-example": "Практичний калькулятор кольору кроля",

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
  "/weight-control": "Контроль ваги",
  "/droppings": "Послід",
  "/rabbit-obesity": "Ожиріння у кролів",
  "/pelleting-problems": "Проблеми з грануляцією",

  // ДОГЛЯД
  "/care": "Догляд",
  "/disinfection": "Дезінфекція",
  "/biosecurity": "Біобезпека",
  "/grooming": "Кігті та зуби",
  "/seasonal-molting": "Линька: норма та патологія",
  "/predators": "Хижаки та шкідники",
  "/wool-block": "Волосяні безоари",

  // РОЗВЕДЕННЯ
  "/okril": "Окріл",
  "/winter-litter": "Зимовий окріл",
  "/weaning": "Відлучення та дорощування",
  "/artificial-feeding": "Штучне вигодовування",
  "/mating-frequency": "Частота злучування",
  "/mating-behavior": "Поведінка при злучці",
  "/okril-control": "Контроль дат",
  "/sexing": "Визначення статі",
  "/doe-preparation": "Підготовка самки до злучки",
  "/buck-management": "Утримання плідника",
  "/false-pregnancy": "Хибна вагітність",
  "/telegony": "Телегонія",
  "/pregnancy-toxemia": "Кетоз",
  "/splay-leg": "Розведені лапки",
  "/dystocia": "Дистоція",
  "/mastitis": "Мастит",
  "/postpartum-care": "Догляд після окролу",
  "/fostering": "Фостеринг",
  "/half-siblings": "Напівсибси",
  "/conveyor": "Конвеєр окролів",

  // ЗДОРОВ'Я
  "/symptoms": "Симптоматичний пошук",
  "/diseases": "Хвороби",
  "/parasites": "Паразити",
  "/rabbit-body-condition": "Кондиція тіла (BCS)",
  "/poisoning": "Отруєння кролів",
  "/zoonoses": "Зонози",
  "/rabbit-urolithiasis": "Сечокам'яна хвороба",
  "/urine-scald": "Опік сечею",
  "/rabbit-eye-diseases": "Хвороби очей",
  "/otitis-media-interna": "Отит середнього та внутрішнього вуха",
  "/encephalitozoon-cuniculi": "Енцефалітозооноз",
  "/rabbit-abscesses": "Абсцеси",
  "/uterine-adenocarcinoma": "Аденокарцинома матки",
  "/chronic-kidney-disease": "Хронічна ниркова недостатність",
  "/treponematosis": "Трепонематоз",
  "/umbilical-hernia": "Пупкова грижа",
  "/cryptorchidism": "Крипторхізм",
  "/senior-sensory-loss": "Втрата зору й слуху",
  "/pyometra": "Піометра",
  "/megaesophagus": "Мегаесофаг",
  "/pyoderma": "Піодерма",
  "/secondary-hyperparathyroidism": "Секундарна гіперпаратиреоз",
  "/ringworm": "Стригучий лишай",
  "/heart-disease": "Хвороба серця",
  "/thymoma": "Тимома",

  // ЛІКУВАННЯ ТА ВЕТЕРИНАРНА ДОПОМОГА
  "/vaccinations": "Вакцинація",
  "/vaccine-reactions": "Реакції на вакцинацію",
  "/medicines": "Препарати",
  "/drug-compatibility": "Сумісність препаратів",
  "/water-medication": "Пропойка",
  "/antibiotic-therapy": "Антибіотикотерапія",
  "/dosage-calculator": "Калькулятор дозування",
  "/treatment": "Схеми лікування",
  "/first-aid": "Перша допомога",
  "/bite-wound-care": "Укушені рани",
  "/pain-management": "Знеболення",
  "/diet-therapy": "Дієтична терапія",
  "/anesthesia-care": "Анестезія та догляд",
  "/neutering": "Кастрація та стерилізація",
  "/lab-diagnostics": "Лаб. діагностика",
  "/necropsy": "Некропсія",
  "/treatment-log": "Журнал лікувань",
  "/rhdv-strains": "Штами RHDV",
  "/palliative-care": "Паліативний догляд",

  // ВЕТЕРИНАРНІ МАНІПУЛЯЦІЇ
  "/vet-injections": "Ін'єкції",
  "/vet-oral-meds": "Таблетки та суспензії",
  "/vet-temperature": "Вимірювання температури",
  "/vet-fecal-sample": "Збір калу на аналіз",
  "/blood-test-reference": "Аналіз крові",

  // СЕЗОННІ ЗАГРОЗИ
  "/seasonal-spring": "Весна: кокцидіоз",
  "/seasonal-summer": "Літо: міаз",
  "/seasonal-autumn": "Осінь: підготовка до зими",
  "/ear-frostbite": "Обмороження вух",
  "/heat-stroke": "Спека",
  "/sun-protection": "Захист від сонця",

  // ПЛАНУВАННЯ
  "/calendar": "Сезонний календар",
  "/tips": "Поради",
  "/breeding-herd": "Маточне поголів'я",

  // ІНСТРУМЕНТИ
  "/calculator": "Калькулятор",
  "/equipment": "Обладнання",
  "/tools": "Інструменти",
  "/rabbit-identification": "Ідентифікація кролів",

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
  "/dna-testing": "ДНК-тест",

  // УПРАВЛІННЯ
  "/economics": "Економіка",
  "/legal": "Юридичний куточок",
  "/sales": "Збут",
  "/profit-calculator": "Калькулятор рентабельності",
  "/composting": "Переробка гною",
  "/insurance-grants": "Страхування та грантова підтримка ОСГ",
  "/import-export-rabbits": "Імпорт та експорт племінних кролів",
  "/rabbit-cooperatives": "Кооперативи та об'єднання кролівників",

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
  "/weighing": "Зважування",
  "/pedigree": "Родовід",
  "/my-calendar": "Календар",
  "/finances": "Фінанси",

  // АДМІН
  "/admin": "Адмін",

  // ОНОВЛЕННЯ
  "/changelog": "Оновлення",

  // ІНФОРМАЦІЯ
  "/about": "Про проєкт",
  "/privacy-policy": "Політика конфіденційності",
  "/terms-of-use": "Умови використання",
  "/behind-the-scenes": "За лаштунками",
  "/android-app": "Застосунок для Android",
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
