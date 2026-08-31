import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import reviews from "./reviewsData";
import "./Reviews.css";

const sourceLabels: Record<string, { icon: string; label: string }> = {
  telegram: { icon: "✈️", label: "Telegram" },
  facebook: { icon: "👍", label: "Facebook" },
};

const Reviews = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => setActiveIndex(null);

  const showPrev = () =>
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + reviews.length) % reviews.length
    );

  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % reviews.length
    );

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  const activeReview = activeIndex !== null ? reviews[activeIndex] : null;

  return (
    <main className="reviews-page">
      <div className="reviews-header">
        <h1>💬 Відгуки</h1>
        <p>Що кажуть про платформу справжні користувачі</p>
      </div>

      <div className="reviews-wrap">
        <div className="reviews-intro">
          <p>
            Платформа — не бізнес на картах Google, тому зібрати відгуки
            звичним способом ми не можемо. Натомість читачі залишають їх у
            наших спільнотах — Telegram та Facebook. Ми регулярно переглядаємо
            обидві групи і закріплюємо тут скріншот кожного нового відгуку.
          </p>
          <div className="reviews-links">
            <a
              href="https://t.me/rabbit_farming_from_a_to_z"
              target="_blank"
              rel="noreferrer"
              className="reviews-link-btn telegram"
            >
              ✈️ Спільнота в Telegram
            </a>
            <a
              href="https://www.facebook.com/share/g/1Fg61VHSKt/"
              target="_blank"
              rel="noreferrer"
              className="reviews-link-btn facebook"
            >
              👍 Група у Facebook
            </a>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="reviews-board">
            {reviews.map((review, index) => {
              const source = sourceLabels[review.source];
              const tiltStyle = {
                "--tilt": `${((index % 5) - 2) * 1.4}deg`,
              } as CSSProperties;

              return (
                <button
                  key={review.id}
                  type="button"
                  className="reviews-photo"
                  style={tiltStyle}
                  onClick={() => openLightbox(index)}
                >
                  <span className="reviews-pin" aria-hidden="true" />
                  <span className="reviews-photo-frame">
                    <img src={review.src} alt={review.alt} loading="lazy" />
                  </span>
                  <span className="reviews-caption">
                    <span className="reviews-caption-source">
                      {source.icon} {source.label}
                    </span>
                    {review.date && (
                      <span className="reviews-caption-date">{review.date}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="reviews-empty">
            <p>
              Поки що тут порожньо — станьте першим, хто залишить відгук в
              одній з наших спільнот. Ми обов'язково закріпимо його тут.
            </p>
          </div>
        )}

        <div className="reviews-bottom-cta">
          <h2>Залишили відгук у групі?</h2>
          <p>Дякуємо — незабаром він з'явиться на цій дошці</p>
          <div className="reviews-bottom-contacts">
            <a
              href="https://t.me/rabbit_farming_from_a_to_z"
              target="_blank"
              rel="noreferrer"
              className="reviews-link-btn telegram large"
            >
              ✈️ Написати в Telegram
            </a>
            <a
              href="https://www.facebook.com/share/g/1Fg61VHSKt/"
              target="_blank"
              rel="noreferrer"
              className="reviews-link-btn facebook large"
            >
              👍 Написати у Facebook
            </a>
          </div>
        </div>

        <div className="reviews-back">
          <Link to="/" className="reviews-back-btn">
            ← На головну
          </Link>
        </div>
      </div>

      {activeReview && (
        <div className="reviews-lightbox" onClick={closeLightbox}>
          <button
            type="button"
            className="reviews-lightbox-close"
            onClick={closeLightbox}
            aria-label="Закрити"
          >
            ✕
          </button>

          {reviews.length > 1 && (
            <button
              type="button"
              className="reviews-lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Попередній відгук"
            >
              ‹
            </button>
          )}

          <img
            src={activeReview.src}
            alt={activeReview.alt}
            className="reviews-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {reviews.length > 1 && (
            <button
              type="button"
              className="reviews-lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Наступний відгук"
            >
              ›
            </button>
          )}
        </div>
      )}
    </main>
  );
};

export default Reviews;
