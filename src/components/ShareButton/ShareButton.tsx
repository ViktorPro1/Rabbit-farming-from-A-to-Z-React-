import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  ViberShareButton,
  ViberIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
} from "react-share";
import "./ShareButton.css";

interface ShareButtonProps {
  title?: string;
}

const ShareButton = ({ title }: ShareButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const url = window.location.href;
  const text = title || document.title;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setOpen(false);
    }, 1800);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <button
        className="share-btn"
        onClick={() => setOpen(true)}
        aria-label="Поділитись"
      >
        ⬆ Поділитись
      </button>

      {open &&
        createPortal(
          <div className="share-overlay" onClick={() => setOpen(false)}>
            <div
              className="share-menu"
              ref={ref}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="share-menu-header">
                <span className="share-menu-title">Поділитись</span>
                <button
                  className="share-menu-close"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="share-networks">
                <div className="share-network-item">
                  <FacebookShareButton url={url} className="share-network-btn">
                    <FacebookIcon size={48} borderRadius={12} />
                  </FacebookShareButton>
                  <span className="share-network-label">Facebook</span>
                </div>

                <div className="share-network-item">
                  <TelegramShareButton
                    url={url}
                    title={text}
                    className="share-network-btn"
                  >
                    <TelegramIcon size={48} borderRadius={12} />
                  </TelegramShareButton>
                  <span className="share-network-label">Telegram</span>
                </div>

                <div className="share-network-item">
                  <ViberShareButton
                    url={url}
                    title={text}
                    className="share-network-btn"
                  >
                    <ViberIcon size={48} borderRadius={12} />
                  </ViberShareButton>
                  <span className="share-network-label">Viber</span>
                </div>

                <div className="share-network-item">
                  <FacebookMessengerShareButton
                    url={url}
                    appId="291494419107518"
                    className="share-network-btn"
                  >
                    <FacebookMessengerIcon size={48} borderRadius={12} />
                  </FacebookMessengerShareButton>
                  <span className="share-network-label">Messenger</span>
                </div>
              </div>

              <div className="share-copy-row">
                <input
                  className="share-url-input"
                  value={url}
                  readOnly
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  className={`share-copy-btn${copied ? " share-copy-btn--done" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? "✓" : "Копіювати"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ShareButton;
