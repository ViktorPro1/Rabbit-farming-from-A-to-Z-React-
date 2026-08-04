interface AssistantToggleProps {
  open: boolean;
  onClick: () => void;
}

export default function AssistantToggle({
  open,
  onClick,
}: AssistantToggleProps) {
  return (
    <button className="assistant-toggle" onClick={onClick}>
      {open ? "✕" : "🐰"}
    </button>
  );
}
