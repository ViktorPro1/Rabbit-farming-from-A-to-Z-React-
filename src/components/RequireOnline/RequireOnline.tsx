import type { ReactNode } from "react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import "./RequireOnline.css";

interface Props {
  children: ReactNode;
}

const RequireOnline = ({ children }: Props) => {
  const isOffline = useOnlineStatus();

  if (isOffline) {
    return (
      <div className="require-online-screen">
        <div className="require-online-card">
          <div className="require-online-icon">📡</div>
          <h2 className="require-online-title">Перевірте з'єднання</h2>
          <p className="require-online-desc">
            Особистий кабінет працює тільки за наявності інтернету — дані обліку
            зберігаються на сервері.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireOnline;
