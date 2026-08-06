import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { logError } from "../../lib/logError";

interface Props {
  children: ReactNode;
  // Текст, що покажеться користувачу. За замовчуванням — загальне повідомлення.
  fallbackTitle?: string;
  // Назва секції для трасування в логах (напр. "Calculator", "AdminPanel"),
  // щоб було видно, яка саме частина застосунку впала.
  boundaryName?: string;
  // Кастомний UI замість дефолтної картки — для некритичних віджетів
  // (напр. Assistant), де при падінні краще нічого не показувати,
  // ніж карту-фолбек посеред екрана. Якщо не передано — рендериться
  // стандартний фолбек з fallbackTitle і кнопкою перезавантаження.
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError(this.props.boundaryName ?? "ErrorBoundary", error);
    if (import.meta.env.DEV) {
      console.error("Component stack:", info.componentStack);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "1.1rem" }}>
            {this.props.fallbackTitle || "Щось пішло не так."}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Перезавантажити сторінку
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
