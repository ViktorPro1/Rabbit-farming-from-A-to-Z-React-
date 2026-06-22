import "./Toast.css";

export type ToastType = "success" | "error";

interface Props {
  message: string;
  type: ToastType;
  visible: boolean;
}

const Toast = ({ message, type, visible }: Props) => {
  if (!message) return null;
  return (
    <div className={`toast toast--${type} ${visible ? "toast--visible" : ""}`}>
      <span className="toast-icon">{type === "success" ? "✓" : "✗"}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
};

export default Toast;
