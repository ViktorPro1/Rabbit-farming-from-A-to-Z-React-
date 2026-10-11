import { QRCodeCanvas } from "qrcode.react";
import type { Rabbit } from "../types";

interface Props {
  rabbits: Rabbit[];
  onClose: () => void;
}

export default function QrModal({ rabbits, onClose }: Props) {
  const baseUrl = window.location.origin;

  function downloadQr(rabbit: Rabbit) {
    const canvas = document.getElementById(
      `qr-canvas-${rabbit.id}`,
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    const cageLabel = rabbit.cage_number
      ? `клітка-${rabbit.cage_number}`
      : rabbit.name;
    link.download = `qr-${cageLabel}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div
      className="help-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="help-modal qr-modal"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div className="help-modal-header">
          <h2>QR-коди кроликів</h2>
          <button
            className="help-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <p className="qr-modal-desc">
          Збережіть QR-код, роздрукуйте і прикріпіть на клітку. При
          скануванні відкриється паспорт кроля.
        </p>
        {rabbits.length === 0 ? (
          <p className="qr-modal-empty">Немає кроликів у реєстрі.</p>
        ) : (
          <div className="qr-grid">
            {rabbits.map((rabbit) => (
              <div key={rabbit.id} className="qr-item">
                <div className="qr-item-title">
                  {rabbit.cage_number
                    ? `Клітка № ${rabbit.cage_number}`
                    : rabbit.name}
                </div>
                <div className="qr-item-name">{rabbit.name}</div>
                <QRCodeCanvas
                  id={`qr-canvas-${rabbit.id}`}
                  value={`${baseUrl}/rabbit/${rabbit.id}`}
                  size={180}
                  bgColor="#fffef5"
                  fgColor="#27500A"
                  level="H"
                  marginSize={2}
                />
                <button
                  className="qr-download-btn"
                  onClick={() => downloadQr(rabbit)}
                >
                  Зберегти PNG
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
