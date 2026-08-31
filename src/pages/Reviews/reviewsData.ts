export interface ReviewScreenshot {
  id: string;
  /**
   * Шлях до файлу скріншота, наприклад "/images/reviews/review-1.jpg".
   * Кладіть самі файли в public/images/reviews/ — окрема таблиця в базі
   * не потрібна, зображення деплояться разом з рештою сайту через Vercel.
   */
  src: string;
  /** Короткий опис для скрінрідерів, напр. "Відгук про облік кролів у Telegram" */
  alt: string;
  source: "telegram" | "facebook";
  /** Необов'язково, напр. "серпень 2026" */
  date?: string;
}

const reviews: ReviewScreenshot[] = [
  // Приклад — розкоментуйте та замініть на реальні дані, коли додасте скрін:
  // {
  //   id: "1",
  //   src: "/images/reviews/review-1.jpg",
  //   alt: "Відгук про облік кролів у Telegram-групі",
  //   source: "telegram",
  //   date: "серпень 2026",
  // },
];

export default reviews;
