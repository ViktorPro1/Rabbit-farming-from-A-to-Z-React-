import { useEffect, useState } from "react";
import "./Hero.css";
import rabbitPhoto from "../../assets/my-breed.webp";
import TempWarningPopup from "../TempWarningPopup/TempWarningPopup";
import RunningTicker from "../RunningTicker/RunningTicker";

const WMO_ICON: Record<number, string> = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "❄️",
  73: "❄️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "⛈️",
  95: "⛈️",
  96: "⛈️",
  99: "⛈️",
};

const Hero = () => {
  const [temp, setTemp] = useState<number | null>(null);
  const [icon, setIcon] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`,
        )
          .then((r) => r.json())
          .then((d) => {
            setTemp(Math.round(d.current_weather.temperature));
            setIcon(WMO_ICON[d.current_weather.weathercode] ?? "🌡️");
          })
          .catch(() => {});
      },
      () => {},
    );
  }, []);

  return (
    <section className="hero">
      <RunningTicker />

      {temp !== null && (
        <button
          className={`hero-weather ${temp >= 25 ? "hero-weather--warn" : ""} ${temp >= 32 ? "hero-weather--critical" : ""}`}
          onClick={() => setShowPopup(true)}
          title="Натисніть для рекомендацій щодо кроликів"
        >
          {icon} {temp}°C
          {temp >= 25 && <span className="hero-weather-dot" />}
        </button>
      )}

      {showPopup && temp !== null && (
        <TempWarningPopup temp={temp} onClose={() => setShowPopup(false)} />
      )}

      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-badge">🌿 Господарський довідник</span>
          <h1>Все про кроликів — від народження до догляду</h1>
          <p>Повний посібник для початківців і досвідчених кролівників.</p>
        </div>
        <div className="hero-image">
          <img
            src={rabbitPhoto}
            alt="Мій кролик"
            width={408}
            height={612}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
