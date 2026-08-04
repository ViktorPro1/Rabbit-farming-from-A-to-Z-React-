import { Link } from "react-router-dom";
import type { RefObject } from "react";
import type { Message } from "./types";

interface AssistantWindowProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function AssistantWindow({
  messages,
  input,
  onInputChange,
  onSend,
  onClose,
  scrollRef,
}: AssistantWindowProps) {
  return (
    <div className="assistant-window">
      <div className="assistant-header">
        <div>
          <strong>Асистент кролівника</strong>
          <span className="status-online">● Онлайн</span>
        </div>
        <button className="assistant-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="assistant-body" ref={scrollRef}>
        {messages.map((message, index) => (
          <div key={index} className={`assistant-message ${message.sender}`}>
            <p>{message.text}</p>
            {message.path && (
              <Link to={message.path} className="assistant-link">
                {message.linkLabel ?? "Переглянути сторінку →"}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="assistant-footer">
        <input
          type="text"
          placeholder="Напишіть повідомлення..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button onClick={onSend} disabled={!input.trim()}>
          {"➤"}
        </button>
      </div>
    </div>
  );
}
