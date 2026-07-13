import React from "react";
import "./PrintButton.css";

interface PrintButtonProps {
  sourceLabel?: string; // напр. "Merck Veterinary Manual, RWAF"
}

const PrintButton: React.FC<PrintButtonProps> = ({ sourceLabel }) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString("uk-UA");

  return (
    <>
      <button
        type="button"
        className="print-button"
        onClick={handlePrint}
        aria-label="Роздрукувати або зберегти як PDF"
      >
        🖨️ Друкувати / Зберегти PDF
      </button>

      {/* Видно тільки при друці, підключається через print.css */}
      <div className="print-footer">
        <p>Джерело: {window.location.href}</p>
        {sourceLabel && <p>Звірено з: {sourceLabel}</p>}
        <p>Дата друку: {today}</p>
        <p>Кролівництво від А до Я — {window.location.origin}</p>
      </div>
    </>
  );
};

export default PrintButton;
