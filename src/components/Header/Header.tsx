import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { CHANGELOG } from "../../data/changelog";
import FontSizeToggle from "../../features/font-size/FontSizeToggle";
import {
  Calculator,
  Users,
  Bell,
  CreditCard,
  Rabbit,
  ShieldCheck,
  LogIn,
  LogOut,
  Crown,
  Handshake,
  Star,
  MessageSquareHeart,
  ChevronDown,
} from "lucide-react";
import "./Header.css";

interface Props {
  session: Session | null;
}

const LATEST_CHANGELOG_ID = CHANGELOG[CHANGELOG.length - 1]?.id ?? 0;

const Header = ({ session }: Props) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // дропдаун "Оновлення"
  const [showMore, setShowMore] = useState(false); // дропдаун "Ще"
  const [showUserMenu, setShowUserMenu] = useState(false); // дропдаун аватара
  const [menuOpen, setMenuOpen] = useState(false); // мобільний drawer
  const [unreadCount, setUnreadCount] = useState(() => {
    const lastSeenId =
      Number(localStorage.getItem("changelog_last_seen_id")) || 0;
    return CHANGELOG.filter((e) => e.id > lastSeenId).length;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .single()
      .then(
        ({ data }) => {
          if (!cancelled) setIsAdmin(!!data);
        },
        (err) => {
          console.error("Не вдалося перевірити права адміністратора:", err);
        },
      );
    return () => {
      cancelled = true;
      setIsAdmin(false);
    };
  }, [session]);

  // Закриття будь-якого відкритого дропдауна кліком поза ним
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowDropdown(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setShowMore(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Блокування скролу коли меню відкрите
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function markChangelogSeen() {
    localStorage.setItem("changelog_last_seen_id", String(LATEST_CHANGELOG_ID));
    setUnreadCount(0);
  }

  function toggleDropdown() {
    if (!showDropdown) {
      markChangelogSeen();
    }
    setShowMore(false);
    setShowUserMenu(false);
    setShowDropdown((prev) => !prev);
  }

  function toggleMore() {
    setShowDropdown(false);
    setShowUserMenu(false);
    setShowMore((prev) => !prev);
  }

  function toggleUserMenu() {
    setShowDropdown(false);
    setShowMore(false);
    setShowUserMenu((prev) => !prev);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setMenuOpen(false);
  }

  const closeMenu = () => setMenuOpen(false);

  // Показуємо 3 останніх в дропдауні (найновіші спочатку)
  const recent = [...CHANGELOG].reverse().slice(0, 3);
  const recentLatestId = recent[0]?.id;

  // Ініціал для аватара (перша літера email користувача)
  const userInitial = session?.user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <header className="header">
        <NavLink to="/" className="header-logo" onClick={closeMenu}>
          <span>🇺🇦</span>
          <span>Кролівництво від А до Я</span>
        </NavLink>

        {/* ДЕСКТОП nav */}
        <nav className="header-nav header-nav--desktop">
          {/* Головні пункти — завжди видимі */}
          <NavLink to="/subscription">Підписка</NavLink>
          <NavLink to="/partnership">Партнерство</NavLink>
          <NavLink to="/nps-survey">Оцінка</NavLink>

          {/* "Ще" — решта пунктів, сховані за замовчуванням */}
          <div className="header-more" ref={moreRef}>
            <button
              className="header-more-trigger"
              onClick={toggleMore}
              aria-expanded={showMore}
            >
              Ще
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className={`header-more-chevron ${showMore ? "header-more-chevron--open" : ""}`}
              />
            </button>

            {showMore && (
              <div className="header-more-dropdown">
                <NavLink to="/calculator" onClick={() => setShowMore(false)}>
                  <Calculator size={16} />
                  Калькулятор
                </NavLink>
                <NavLink to="/community" onClick={() => setShowMore(false)}>
                  <Users size={16} />
                  Спільноти
                </NavLink>
                <NavLink to="/reviews" onClick={() => setShowMore(false)}>
                  <Star size={16} />
                  Відгуки
                </NavLink>
              </div>
            )}
          </div>

          {/* Оновлення — іконка-дзвіночок, не займає горизонтального місця */}
          <div className="changelog-menu" ref={dropdownRef}>
            <button
              className="changelog-icon-trigger"
              onClick={toggleDropdown}
              aria-label="Оновлення"
              aria-expanded={showDropdown}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="changelog-dot" aria-hidden="true" />
              )}
            </button>

            {showDropdown && (
              <div className="changelog-dropdown">
                <div className="changelog-dropdown-items">
                  {recent.map((entry) => (
                    <div key={entry.id} className="changelog-item">
                      {(entry.id === recentLatestId ||
                        entry.isSubscription) && (
                        <div className="changelog-item-badges">
                          {entry.id === recentLatestId && (
                            <span className="changelog-card-badge">НОВЕ</span>
                          )}
                          {entry.isSubscription && (
                            <NavLink
                              to="/subscription"
                              className="badge-subscription"
                              onClick={() => setShowDropdown(false)}
                            >
                              <Crown size={12} strokeWidth={2.5} />
                              Підписка
                            </NavLink>
                          )}
                        </div>
                      )}
                      <span className="changelog-item-title">
                        {entry.title}
                      </span>
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
                </div>
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

          <ThemeToggle />
          <FontSizeToggle />

          {/* Акцентна пігулка: "Увійти" для гостя, "Мої кролики" після входу */}
          {session ? (
            <NavLink to="/registry" className="header-accent-pill">
              <Rabbit size={14} strokeWidth={2.5} />
              Мої кролики
            </NavLink>
          ) : (
            <NavLink to="/auth" className="header-accent-pill">
              <LogIn size={14} strokeWidth={2.5} />
              Увійти
            </NavLink>
          )}

          {/* Аватар — тільки для залогінених, дає доступ до Адмін/Вийти */}
          {session && (
            <div className="header-user" ref={userMenuRef}>
              <button
                className="header-avatar"
                onClick={toggleUserMenu}
                aria-label="Меню користувача"
                aria-expanded={showUserMenu}
              >
                {userInitial}
              </button>

              {showUserMenu && (
                <div className="header-user-dropdown">
                  {isAdmin && (
                    <NavLink to="/admin" onClick={() => setShowUserMenu(false)}>
                      <ShieldCheck size={16} />
                      Адмін
                    </NavLink>
                  )}
                  <button
                    className="header-user-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Вийти
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* МОБІЛЬНИЙ рядок праворуч */}
        <div className="header-mobile-right">
          <ThemeToggle />
          <FontSizeToggle />
          <button
            className="burger-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Меню"
            aria-expanded={menuOpen}
          >
            <span
              className={`burger-icon ${menuOpen ? "burger-icon--open" : ""}`}
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`drawer-overlay ${menuOpen ? "drawer-overlay--visible" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* DRAWER — без змін відносно попередньої версії, тут усі пункти видно завжди */}
      <nav
        className={`drawer ${menuOpen ? "drawer--open" : ""}`}
        aria-label="Мобільне меню"
        onTouchStart={(e) => {
          swipeStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (swipeStartX.current === null) return;
          const diff = swipeStartX.current - e.changedTouches[0].clientX;
          if (diff < -60) closeMenu();
          swipeStartX.current = null;
        }}
      >
        <div className="drawer-header">
          <span className="drawer-logo">🐇 Меню</span>
          <button
            className="drawer-close"
            onClick={closeMenu}
            aria-label="Закрити меню"
          >
            ✕
          </button>
        </div>

        <div className="drawer-links">
          <NavLink to="/calculator" onClick={closeMenu}>
            <Calculator size={18} />
            Калькулятор
          </NavLink>
          <NavLink to="/community" onClick={closeMenu}>
            <Users size={18} />
            Спільноти
          </NavLink>
          <NavLink to="/partnership" onClick={closeMenu}>
            <Handshake size={18} />
            Партнерство
          </NavLink>
          <NavLink to="/reviews" onClick={closeMenu}>
            <Star size={18} />
            Відгуки
          </NavLink>
          <NavLink to="/nps-survey" onClick={closeMenu}>
            <MessageSquareHeart size={18} />
            Оцінка
          </NavLink>
          <NavLink
            to="/changelog"
            onClick={() => {
              markChangelogSeen();
              closeMenu();
            }}
          >
            <Bell size={18} />
            Оновлення
            {unreadCount > 0 && (
              <span className="changelog-badge">{unreadCount}</span>
            )}
          </NavLink>
          <NavLink to="/subscription" onClick={closeMenu}>
            <CreditCard size={18} />
            Підписка
          </NavLink>
          {session ? (
            <>
              <NavLink to="/registry" onClick={closeMenu}>
                <Rabbit size={18} />
                Мої кролики
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={closeMenu}>
                  <ShieldCheck size={18} />
                  Адмін
                </NavLink>
              )}
              <button className="drawer-logout" onClick={handleLogout}>
                <LogOut size={18} />
                Вийти
              </button>
            </>
          ) : (
            <NavLink to="/auth" onClick={closeMenu}>
              <LogIn size={18} />
              Увійти
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
