import { breeds } from "../../data/breeds";
import { Link } from "react-router-dom";
import "./Breeds.css";

const Breeds = () => {
  return (
    <main className="breeds-page">
      <div className="breeds-header">
        <h1>Породи кролів в Україні</h1>
        <p>
          М'ясні, хутрові, велетенські й декоративні — повний довідник порід
        </p>
      </div>

      <div className="breeds-wrap">
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
            <strong>Для хутра:</strong> рекс, радянська шиншила, віденський
            блакитний, чорно-бурий, полтавське срібло.
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
      </div>
      <div className="breeds-back">
        <Link to="/" className="breeds-back-btn">
          ⬅ На головну
        </Link>
      </div>
    </main>
  );
};

export default Breeds;
