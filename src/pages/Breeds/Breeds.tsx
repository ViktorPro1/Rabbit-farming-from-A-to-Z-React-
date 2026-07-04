import { breeds } from "../../data/breeds";
import { Link } from "react-router-dom";
import "./Breeds.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const Breeds = () => {
  const totalBreeds = breeds.length;

  return (
    <main className="breeds-page">
      <div className="breeds-header">
        <h1>Породи кролів в Україні</h1>
        <p>
          М'ясні, хутрові, велетенські й декоративні — повний довідник порід
        </p>
      </div>

      <div className="breeds-wrap">
        <div className="breeds-count">
          <span className="breeds-count-number">{totalBreeds}</span>
          <span className="breeds-count-label">
            {totalBreeds === 1
              ? "порода в довіднику"
              : totalBreeds >= 2 && totalBreeds <= 4
                ? "породи в довіднику"
                : "порід у довіднику"}
          </span>
        </div>

        <div className="breeds-grid">
          {breeds.map((breed) => (
            <article key={breed.id} className="breed-card">
              <img src={breed.image} alt={breed.name} />
              <div className="breed-body">
                <h3>{breed.name}</h3>
                <div className="breed-chips">
                  {breed.chips.map((chip) => (
                    <span key={chip} className="breed-chip">
                      {chip}
                    </span>
                  ))}
                </div>
                <p>{breed.description}</p>
                <p>
                  <strong>Плюси:</strong> {breed.pros}
                </p>
                <p>
                  <strong>Мінуси:</strong> {breed.cons}
                </p>
                {breed.articleUrl && (
                  <a
                    href={breed.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="breed-article-link"
                  >
                    Читати статтю
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="breeds-tip">
          <h2>Швидкі поради з вибору породи</h2>
          <p>
            <strong>Для м'яса:</strong> почни з каліфорнійського або
            новозеландського білого — швидкий приріст і прогнозовані результати.
          </p>
          <p>
            <strong>Для хутра:</strong> рекс, шиншила, віденський блакитний,
            чорно-бурий, полтавське срібло.
          </p>
          <p>
            <strong>Для дому:</strong> карликовий баран, голландський карлик,
            левеня, рекс.
          </p>
          <p>
            <strong>Менеджмент:</strong> веди облік злучок, окролів, приростів;
            фіксуй раціони й вакцинації.
          </p>
        </div>

        <div className="breeds-missing">
          <p>
            Не знайшли тієї породи, що шукали? Напишіть нам у{" "}
            <a
              href="https://t.me/rabbit_farming_from_a_to_z"
              target="_blank"
              rel="noopener noreferrer"
              className="breeds-missing-link"
            >
              Telegram-спільноту
            </a>{" "}
            — і ми обов'язково її додамо.
          </p>
        </div>
      </div>

      {/* ЧИТАЙТЕ ТАКОЖ */}
      <div className="breeds-related">
        <h3 className="breeds-related-title">Читайте також</h3>
        <div className="breeds-related-grid">
          <Link to="/breeding" className="breeds-related-link">
            🧬 Схрещування
          </Link>
          <Link to="/breed-standards" className="breeds-related-link">
            📜 Стандарти порід
          </Link>
          <Link to="/genetics" className="breeds-related-link">
            🎨 Генетика забарвлення
          </Link>
          <Link to="/select-buck" className="breeds-related-link">
            ♂️ Вибір племінного самця
          </Link>
          <Link to="/select-doe" className="breeds-related-link">
            ♀️ Вибір племінної самки
          </Link>
        </div>
      </div>

      <div className="breeds-back">
        <Link to="/" className="breeds-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default Breeds;
