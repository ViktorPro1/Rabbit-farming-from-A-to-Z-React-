import { helpItems } from "../helpItems";

interface Props {
  onClose: () => void;
}

export default function HelpModal({ onClose }: Props) {
  return (
    <div
      className="help-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="help-modal"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <div className="help-modal-header">
          <h2>Як користуватись</h2>
          <button className="help-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="help-list">
          {helpItems.map((item) => (
            <div key={item.title} className="help-item">
              <span className="help-icon">{item.icon}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
