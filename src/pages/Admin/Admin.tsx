import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Admin.css";

interface Props {
  session: Session;
}

interface InviteCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  email: string | null;
  created_at: string;
}

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  invite_code: string | null;
  invite_code_id: string | null;
}

interface DeactivatedUser {
  id: string;
  email: string;
}

export default function Admin({ session }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [deactivated, setDeactivated] = useState<DeactivatedUser[]>([]);
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCodes() {
    const { data } = await supabase
      .from("invite_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes(data || []);
    return data || [];
  }

  async function fetchUsers(allCodes: InviteCode[]) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, created_at");

    if (profiles && profiles.length > 0) {
      const usedCodes = allCodes.filter((c) => c.is_used);
      const mapped: RegisteredUser[] = profiles.map((p: Profile) => {
        const matchedCode = usedCodes.find((c) => c.used_by === p.id);
        return {
          id: p.id,
          email: p.email || "—",
          created_at: p.created_at,
          invite_code: matchedCode?.code || "—",
          invite_code_id: matchedCode?.id || null,
        };
      });
      setUsers(mapped);
    } else {
      setUsers([]);
    }
  }

  async function fetchDeactivated() {
    // Користувачі які є в auth але не в profiles
    const { data } = await supabase.rpc("get_deactivated_users");
    setDeactivated(data || []);
  }

  useEffect(() => {
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          setIsAdmin(true);
          const allCodes = await fetchCodes();
          await fetchUsers(allCodes);
          await fetchDeactivated();
        }
        setLoading(false);
      });
  }, [session.user.id]);

  async function handleAdd() {
    if (!newCode.trim()) return;
    setError("");
    const { error } = await supabase
      .from("invite_codes")
      .insert({ code: newCode.trim().toUpperCase() });
    if (error) {
      setError("Код вже існує або помилка збереження");
    } else {
      setNewCode("");
      const allCodes = await fetchCodes();
      await fetchUsers(allCodes);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("invite_codes").delete().eq("id", id);
    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
  }

  async function handleDeleteUser(user: RegisteredUser) {
    const confirm = window.confirm(
      `Видалити користувача ${user.email}?\nВін втратить доступ до додатку.`,
    );
    if (!confirm) return;

    await supabase.from("profiles").delete().eq("id", user.id);

    if (user.invite_code_id) {
      await supabase
        .from("invite_codes")
        .update({ is_used: false, used_by: null })
        .eq("id", user.invite_code_id);
    }

    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
    await fetchDeactivated();
  }

  async function handleRestoreUser(user: DeactivatedUser) {
    const confirm = window.confirm(`Відновити доступ для ${user.email}?`);
    if (!confirm) return;

    await supabase.from("profiles").insert({ id: user.id, email: user.email });

    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
    await fetchDeactivated();
  }

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "KROL-";
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewCode(code);
  }

  if (loading) return <p style={{ padding: "2rem" }}>Завантаження...</p>;
  if (!isAdmin) return <p style={{ padding: "2rem" }}>Доступ заборонено.</p>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Адмін панель</h1>
      </div>

      {/* Активні користувачі */}
      <div className="admin-section">
        <h2>
          👥 Зареєстровані користувачі{" "}
          <span className="admin-count">{users.length}</span>
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Інвайт код</th>
                <th>Дата реєстрації</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", opacity: 0.5 }}>
                    Немає користувачів
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>{user.email}</td>
                    <td className="code-text">{user.invite_code}</td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString("uk-UA")}
                    </td>
                    <td>
                      {user.id !== session.user.id && (
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDeleteUser(user)}
                        >
                          Видалити
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Деактивовані користувачі */}
      {deactivated.length > 0 && (
        <div className="admin-section">
          <h2>
            🔒 Деактивовані користувачі{" "}
            <span className="admin-count">{deactivated.length}</span>
          </h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deactivated.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="admin-btn-add"
                        onClick={() => handleRestoreUser(user)}
                      >
                        Відновити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Інвайт коди */}
      <div className="admin-section">
        <h2>🎟️ Інвайт коди</h2>

        <div className="admin-add">
          <input
            placeholder="Новий код"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
          />
          <button className="admin-btn-generate" onClick={generateCode}>
            Генерувати
          </button>
          <button
            className="admin-btn-add"
            onClick={handleAdd}
            disabled={!newCode.trim()}
          >
            Додати
          </button>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Код</th>
                <th>Статус</th>
                <th>Створено</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className={code.is_used ? "used" : ""}>
                  <td className="code-text">{code.code}</td>
                  <td>
                    <span
                      className={`code-status ${code.is_used ? "used" : "free"}`}
                    >
                      {code.is_used ? "Використано" : "Вільний"}
                    </span>
                  </td>
                  <td>
                    {new Date(code.created_at).toLocaleDateString("uk-UA")}
                  </td>
                  <td>
                    {!code.is_used && (
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDelete(code.id)}
                      >
                        Видалити
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
