import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  // Текст, що покажеться користувачу. За замовчуванням — загальне повідомлення.
  fallbackTitle?: string;
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
    console.error(
      "ErrorBoundary перехопив помилку:",
      error,
      info.componentStack,
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
