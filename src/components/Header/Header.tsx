import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import "./Header.css";

interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(!!data);
      });

    return () => {
      cancelled = true;
      setIsAdmin(false);
    };
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="header">
      <NavLink to="/" className="header-logo">
        <span>🐇</span>
        <span>Кролівництво від А до Я</span>
      </NavLink>
      <nav className="header-nav">
        <NavLink to="/breeds">Породи</NavLink>
        <NavLink to="/care">Догляд</NavLink>
        <NavLink to="/feeding">Годування</NavLink>
        <NavLink to="/diseases">Хвороби</NavLink>
        <NavLink to="/calculator">Калькулятор</NavLink>
        <NavLink to="/community">Спільноти</NavLink>
        {session ? (
          <>
            <NavLink to="/registry">Мої кролики</NavLink>
            {isAdmin && <NavLink to="/admin">Адмін</NavLink>}
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
