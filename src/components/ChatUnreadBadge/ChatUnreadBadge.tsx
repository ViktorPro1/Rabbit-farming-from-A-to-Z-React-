import "./ChatUnreadBadge.css";

interface Props {
  count: number;
  // "number" - кружечок із числом, "dot" - лише крапка (для згорнутих меню)
  variant?: "number" | "dot";
}

// Червоний кружечок нових повідомлень чату. При нулі нічого не малює.
export default function ChatUnreadBadge({ count, variant = "number" }: Props) {
  if (count <= 0) return null;

  if (variant === "dot") {
    return (
      <>
        <span className="chat-unread-dot" aria-hidden="true" />
        <span className="chat-unread-sr">Є нові повідомлення в чаті</span>
      </>
    );
  }

  return (
    <span className="chat-unread-badge" title={`Нових повідомлень: ${count}`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
