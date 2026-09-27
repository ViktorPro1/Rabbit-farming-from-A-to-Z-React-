import { Download } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import PageLayout from "../../components/PageLayout/PageLayout";
import "./Vizytka.css";

const VIZYTKA_IMAGE_PATH = "/images/vizytka.png";

const VIZYTKA_DOWNLOAD_FILENAME = "vizytka-krolivnytstvo-vid-a-do-ya.png";

const Vizytka = () => {
  // Додано: логування кожного завантаження в таблицю vizytka_downloads
  // для лічильника в адмінці. Не блокує саме завантаження файлу —
  // браузер починає скачувати за атрибутом download незалежно від
  // результату цього запиту, а помилку лише логуємо.
  function handleDownloadClick() {
    supabase
      .from("vizytka_downloads")
      .insert({})
      .then(({ error }) => {
        if (error) logError("Vizytka.handleDownloadClick", error);
      });
  }

  return (
    <PageLayout
      title="Візитка"
      subtitle="Офіційна візитка платформи «Кролівництво від А до Я»"
      shareTitle="Візитка — Кролівництво від А до Я"
    >
      <section className="vizytka-page">
        <p className="vizytka-intro">
          Тут Ви можете переглянути та завантажити нашу візитку з основною
          інформацією про платформу, посиланням на сайт і контактами для
          зв’язку. Збережіть її на телефон або комп’ютер, щоб за потреби
          поділитися платформою з іншими чи роздрукувати візитку.
        </p>

        <div className="vizytka-card">
          <img
            src={VIZYTKA_IMAGE_PATH}
            alt="Візитка платформи «Кролівництво від А до Я»"
            className="vizytka-image"
            width={619}
            height={414}
            loading="lazy"
          />
        </div>

        <a
          href={VIZYTKA_IMAGE_PATH}
          download={VIZYTKA_DOWNLOAD_FILENAME}
          className="vizytka-download-btn"
          onClick={handleDownloadClick}
        >
          <Download size={18} strokeWidth={2.5} />
          Завантажити візитку
        </a>
      </section>
    </PageLayout>
  );
};

export default Vizytka;
