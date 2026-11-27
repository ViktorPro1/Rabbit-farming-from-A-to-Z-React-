
// Додано: словник "тема сайту -> функція обліку (кабінету)".
// Використовується компонентом CabinetPromo, щоб показати на сторінці теми
// віконце про те, що ця функція вже реалізована в обліку.
// Нічого не видалено і не замінено, це новий файл.
// Ключ словника - path теми з src/data/sectionCards/groups/*.ts.
// Тексти відповідають описам розділів на сторінці підписки (Subscription.tsx)
// та логіці BreedingPlan/pairLogic.ts. Нічого понад це не обіцяється.

export interface CabinetPromo {
  /** Назва розділу кабінету, як у меню NavPanel */
  feature: string;
  /** Маршрут розділу в кабінеті (для довідки; кнопка веде на /subscription) */
  route: string;
  /** Заголовок віконця */
  title: string;
  /** Короткий текст: що саме облік уже робить */
  text: string;
}

// Позначка під текстом віконця (зелений бейдж). Кабінет працює за підпискою.
export const PROMO_BADGE = "Доступно за підпискою";

// ---------------------------------------------------------------------------
// Спільні описи розділів кабінету (одне віконце може обслуговувати кілька тем)
// ---------------------------------------------------------------------------

// Відповідає pairLogic.ts (assessPair): перевірка пар за родоводом на 3 покоління.
const BREEDING_PLAN: CabinetPromo = {
  feature: "План підбору",
  route: "/breeding-plan",
  title: "План підбору вже є в обліку!",
  text: "Плануєте схрещування кролів? У розділі «План підбору» система сама перевіряє пари за родоводом на 3 покоління і показує, чи можна парувати самку з самцем.",
};

const PEDIGREE: CabinetPromo = {
  feature: "Родовід",
  route: "/pedigree",
  title: "Родовід уже є в обліку!",
  text: "Ведете родовід на папері? У розділі «Родовід» система будує дерево походження на 3 або 4 покоління, а предків призначають прямо з реєстру.",
};

const MATINGS: CabinetPromo = {
  feature: "Парування",
  route: "/matings",
  title: "Дати окролу вже рахуються в обліку!",
  text: "Рахуєте дати вручну? У розділі «Парування» контрольна злучка, окріл і відлучення розраховуються самі, а «Календар» збирає їх по днях.",
};

const VACCINATION: CabinetPromo = {
  feature: "Вакцинація",
  route: "/my-vaccinations",
  title: "Графік щеплень уже є в обліку!",
  text: "Боїтеся забути про ревакцинацію? У розділі «Вакцинація» ви фіксуєте препарат і дату, а система показує наступне щеплення й нагадує за 14 днів.",
};

const TREATMENT: CabinetPromo = {
  feature: "Лікування",
  route: "/my-treatments",
  title: "Облік лікування вже є в обліку!",
  text: "Записуєте лікування в зошит? У розділі «Лікування» є довідник препаратів з дозуванням, а система сама розраховує наступний курс і підсвічує прострочені прийоми.",
};

const DISINFECTION: CabinetPromo = {
  feature: "Дезінфекція",
  route: "/disinfection-log",
  title: "Журнал дезінфекції вже є в обліку!",
  text: "Потрібен журнал обробок? У розділі «Дезінфекція» ви фіксуєте клітку, дату й засіб, і вся історія обробок завжди під рукою.",
};

const APTECHKA: CabinetPromo = {
  feature: "Аптечка",
  route: "/aptechka",
  title: "Облік ліків уже є в обліку!",
  text: "Слідкуєте за залишками й термінами придатності? У розділі «Аптечка» ветпрепарати обліковуються по кожній партії, з контролем залишку та терміну придатності.",
};

const QUARANTINE: CabinetPromo = {
  feature: "Карантин",
  route: "/quarantine",
  title: "Облік карантину вже є в обліку!",
  text: "Ізолюєте тварин? У розділі «Карантин» ви фіксуєте причину, дати та результат: видужав, забій чи загинув.",
};

const WEIGHING: CabinetPromo = {
  feature: "Зважування",
  route: "/weighing",
  title: "Контроль ваги вже є в обліку!",
  text: "Рахуєте приріст на калькуляторі? У розділі «Зважування» ви вносите вагу, а система сама рахує приріст у грамах на добу між зважуваннями.",
};

const SOFTWARE: CabinetPromo = {
  feature: "Кабінет господарства",
  route: "/registry",
  title: "Цифровий облік уже є!",
  text: "Шукаєте цифровий журнал замість паперового? Кабінет веде реєстр, парування, окроли, лікування, фінанси та родоводи, має резервну копію й експорт у CSV.",
};

const COST: CabinetPromo = {
  feature: "Собівартість",
  route: "/cost-analysis",
  title: "Собівартість уже рахується в обліку!",
  text: "Хочете знати, скільки коштує кролик? У розділі «Собівартість» система сама поєднує Фінанси, Відгодівлю й Зважування та показує собівартість одного кроля й 1 кг ваги.",
};

const FINANCES: CabinetPromo = {
  feature: "Фінанси",
  route: "/finances",
  title: "Облік доходів і витрат уже є!",
  text: "Ведете гроші господарства в зошиті? У розділі «Фінанси» дохід із продажів рахується автоматично, витрати вносите по категоріях, а графік показує прибуток по місяцях.",
};

const IDENTIFICATION: CabinetPromo = {
  feature: "Нумерація та QR-коди",
  route: "/numbering",
  title: "Нумерація тварин уже є в обліку!",
  text: "Потрібна система номерів? У розділі «Нумерація» система сама пропонує наступний номер, наприклад VK-F011, а «QR-коди» дають мітку для кожного кролика й клітки.",
};

const FATTENING: CabinetPromo = {
  feature: "Відгодівля",
  route: "/fattening",
  title: "Планування забою вже є в обліку!",
  text: "Плануєте забій? У розділі «Відгодівля» система показує, скільки днів лишилось до планової дати забою, а Push-сповіщення нагадує про неї на телефон.",
};

const ARCHIVE: CabinetPromo = {
  feature: "Архів",
  route: "/archive",
  title: "Облік вибракування вже є в обліку!",
  text: "Вибраковуєте тварин? При архівуванні в реєстрі ви обираєте причину, а «Архів» зберігає всю історію тварини з можливістю відновлення.",
};

const FEED_CALC: CabinetPromo = {
  feature: "Калькулятор корму та Раціони",
  route: "/grain-calculator",
  title: "Розрахунок суміші вже є в обліку!",
  text: "Рахуєте зернову суміш вручну? «Калькулятор корму» складає її для стада й відгодівлі, а готовий рецепт зберігається в «Раціонах».",
};

const PADDOCKS: CabinetPromo = {
  feature: "Вольєр",
  route: "/paddocks",
  title: "Облік вольєрів уже є в обліку!",
  text: "Тримаєте тварин групою? У розділі «Вольєр» ви ведете один плідник і кілька самок, з окремим обліком кожної самки та злучками й окролами по загону.",
};

const CALENDAR: CabinetPromo = {
  feature: "Календар",
  route: "/my-calendar",
  title: "Календар подій уже є в обліку!",
  text: "Тримаєте дати в голові? «Календар» сам збирає злучки, окроли, відлучення, вакцинації й лікування в один список по днях.",
};

const FEED_STOCK: CabinetPromo = {
  feature: "Корми",
  route: "/feed-stock",
  title: "Облік запасів кормів уже є!",
  text: "Слідкуєте за запасами? У розділі «Корми» облік іде по кожній партії, з контролем залишку й попередженням, коли корм закінчується.",
};

// ---------------------------------------------------------------------------
// Словник: path теми -> віконце
// ---------------------------------------------------------------------------

export const cabinetPromos: Record<string, CabinetPromo> = {
  // План підбору
  "/breeding": BREEDING_PLAN,
  "/half-siblings": BREEDING_PLAN,
  "/select-buck": BREEDING_PLAN,
  "/select-doe": BREEDING_PLAN,
  "/first-cross-plan": BREEDING_PLAN,

  // Родовід
  "/pedigree-records": PEDIGREE,
  "/selection": PEDIGREE,

  // Парування (+ Календар, Push-сповіщення)
  "/mating-frequency": MATINGS,
  "/okril": MATINGS,
  "/okril-control": MATINGS,
  "/dates-calculator": MATINGS,
  "/conveyor": MATINGS,
  "/winter-litter": MATINGS,
  "/weaning": MATINGS,

  // Вакцинація
  "/vaccinations": VACCINATION,
  "/vaccine-reactions": VACCINATION,
  "/rhdv-strains": VACCINATION,

  // Лікування
  "/treatment-log": TREATMENT,
  "/treatment": TREATMENT,
  "/water-medication": TREATMENT,
  "/antibiotic-therapy": TREATMENT,

  // Дезінфекція, Аптечка, Карантин
  "/disinfection": DISINFECTION,
  "/med-storage": APTECHKA,
  "/biosecurity": QUARANTINE,

  // Зважування
  "/weight-control": WEIGHING,

  // Цифровий облік загалом
  "/farm-management-software": SOFTWARE,
  "/history": SOFTWARE,

  // Фінанси та собівартість
  "/economics": COST,
  "/profit-calculator": COST,
  "/sales": FINANCES,
  "/breeding-stock-pricing": FINANCES,

  // Нумерація та QR-коди
  "/rabbit-identification": IDENTIFICATION,

  // Слабші збіги (текст обережний, лише те, що розділ справді робить)
  "/slaughter": FATTENING,
  "/culling": ARCHIVE,
  "/feeding": FEED_CALC,
  "/compound-feed": FEED_CALC,
  "/pelleting-problems": FEED_CALC,
  "/group-housing": PADDOCKS,
  "/calendar": CALENDAR,
  "/crops": FEED_STOCK,
};

/** Повертає віконце для шляху теми або undefined, якщо для теми його немає */
export function getCabinetPromo(pathname: string): CabinetPromo | undefined {
  // Прибираємо кінцевий слеш, щоб "/breeding/" і "/breeding" збігалися
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return cabinetPromos[clean];
}
