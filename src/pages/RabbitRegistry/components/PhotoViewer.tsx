
interface Props {
  url: string;
  name: string;
  onClose: () => void;
}

export default function PhotoViewer({ url, name, onClose }: Props) {
  return (
    <div
      className="help-overlay photo-viewer-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="photo-viewer"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <button
          className="help-close photo-viewer-close"
          onClick={onClose}
          aria-label="Закрити фото"
        >
          ✕
        </button>
        <img
          className="photo-viewer-img"
          src={url}
          alt={`Фото: ${name}`}
        />
      </div>
    </div>
  );
}
