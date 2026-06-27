import { useState, useEffect } from "react";
import "./ScrollToTop.css";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`stt-btn${visible ? " stt-btn--visible" : ""}`}
      onClick={handleClick}
      aria-label="Прокрутити вгору"
      title="Вгору"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
