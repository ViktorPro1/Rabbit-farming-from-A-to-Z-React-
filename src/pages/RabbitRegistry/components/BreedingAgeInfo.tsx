import { useState } from "react";


export default function BreedingAgeInfo() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="registry-info">
      <button
        className="registry-info-toggle"
        onClick={() => setShowInfo(!showInfo)}
      >
        <span>📋 Рекомендований вік утримання у племінному стаді</span>
        <span>{showInfo ? "▲" : "▼"}</span>
      </button>

      {showInfo && (
        <>
          <p className="registry-info-text">
            Правильний підбір племінних тварин за віком безпосередньо впливає
            на якість потомства та продуктивність стада.
          </p>

          <div className="registry-info-grid">
            <div className="registry-info-item">
              <span className="registry-info-icon">♀</span>

              <div>
                <strong>Самки — перша злучка</strong>

                <span>Середні породи: 5–6 міс., вага не менше 2,5 кг</span>

                <span>
                  Великі породи (Фландр, Велетень): 6–7 міс., від 3,5 кг
                </span>

                <span className="registry-info-badge">
                  після першої линьки
                </span>
              </div>
            </div>

            <div className="registry-info-item">
              <span className="registry-info-icon">♂</span>

              <div>
                <strong>Самці — перша злучка</strong>

                <span>Середні породи: 6–7 міс.</span>

                <span>Великі породи: 7–8 міс.</span>

                <span className="registry-info-badge">
                  після другої линьки
                </span>
              </div>
            </div>

            <div className="registry-info-item">
              <span className="registry-info-icon">📅</span>

              <div>
                <strong>Самки — строк використання</strong>

                <span>В середньому 3 роки у продуктивному стаді</span>

                <span>За хорошого здоров'я — до 4–5 років</span>

                <span className="registry-info-badge">
                  вибраковка після 3 р.
                </span>
              </div>
            </div>

            <div className="registry-info-item">
              <span className="registry-info-icon">📅</span>

              <div>
                <strong>Самці — строк використання</strong>

                <span>Зазвичай не більше 3 років</span>

                <span>1 самець на 8–10 самок</span>

                <span className="registry-info-badge">
                  вибраковка після 3 р.
                </span>
              </div>
            </div>
          </div>

          <div className="registry-info-warning">
            ⚠️ <strong>Підбір пар:</strong> За молодими самками закріплюють
            старшого самця, за старими — молодого. Не допускайте до злучки
            тварин, які не досягли 2/3 живої маси дорослих особин своєї
            породи.
          </div>

          <div className="registry-info-success">
            ✅ <strong>Причини дострокового вибракування самок:</strong> з'їла
            кроленят двічі поспіль, не завагітніла після контрольної злучки,
            менше 4–5 кроленят в двох окролах поспіль, погане здоров'я або
            надмірна агресивність.
          </div>
        </>
      )}
    </div>
  );
}
