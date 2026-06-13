import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { CHANGELOG } from "../../data/changelog";
import "./Header.css";

interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => {
    const lastSeen = localStorage.getItem("changelog_last_seen");
    if (!lastSeen) return CHANGELOG.length;
    return CHANGELOG.filter((e) => e.created_at > lastSeen).length;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleDropdown() {
    if (!showDropdown) {
      localStorage.setItem("changelog_last_seen", new Date().toISOString());
      setUnreadCount(0);
    }
    setShowDropdown((prev) => !prev);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Показуємо 3 останніх в дропдауні (найновіші спочатку)
  const recent = [...CHANGELOG].reverse().slice(0, 3);

  return (
    <header className="header">
      <NavLink to="/" className="header-logo">
        <span>🇺🇦</span>
        <span>Кролівництво від А до Я</span>
      </NavLink>
      <nav className="header-nav">
        <NavLink to="/calculator">Калькулятор</NavLink>
        <NavLink to="/community">Спільноти</NavLink>

        <div className="changelog-menu" ref={dropdownRef}>
          <button className="changelog-trigger" onClick={toggleDropdown}>
            Оновлення
            {unreadCount > 0 && (
              <span className="changelog-badge">{unreadCount}</span>
            )}
          </button>

          {showDropdown && (
            <div className="changelog-dropdown">
              {recent.map((entry) => (
                <div key={entry.id} className="changelog-item">
                  <span className="changelog-item-title">{entry.title}</span>
                  {entry.description && (
                    <span className="changelog-item-desc">
                      {entry.description}
                    </span>
                  )}
                  <span className="changelog-item-date">
                    {formatDate(entry.created_at)}
                  </span>
                </div>
              ))}
              <NavLink
                to="/changelog"
                className="changelog-all"
                onClick={() => setShowDropdown(false)}
              >
                Всі оновлення →
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/subscription">Підписка</NavLink>
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
        <ThemeToggle />
      </nav>
    </header>
  );
};

export default Header;
