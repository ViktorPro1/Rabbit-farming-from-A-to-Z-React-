import "./Hero.css";
import rabbitPhoto from "../../assets/my-breed.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-badge">🌿 Господарський довідник</span>
        <h1>Все про кроликів — від народження до догляду</h1>
        <p>Повний посібник для початківців і досвідчених кролівників.</p>
        <button className="hero-btn">Почати читати</button>
      </div>
      <div className="hero-image">
        <img src={rabbitPhoto} alt="Мій кролик" />
      </div>
    </section>
  );
};

export default Hero;
