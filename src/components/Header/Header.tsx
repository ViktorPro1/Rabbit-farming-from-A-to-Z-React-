import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import "./Header.css";

interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="header">
      <div className="header-logo">
        <span>🐇</span>
        <span>Кролівництво від А до Я</span>
      </div>
      <nav className="header-nav">
        <NavLink to="/breeds">Породи</NavLink>
        <NavLink to="/care">Догляд</NavLink>
        <NavLink to="/feeding">Годування</NavLink>
        <NavLink to="/diseases">Хвороби</NavLink>
        <NavLink to="/calculator">Калькулятор</NavLink>
        {session ? (
          <>
            <NavLink to="/registry">Мої кролики</NavLink>
            <NavLink to="/admin">Адмін</NavLink>
            <button className="header-logout" onClick={handleLogout}>
              Вийти
            </button>
          </>
        ) : (
          <NavLink to="/auth">Увійти</NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;
