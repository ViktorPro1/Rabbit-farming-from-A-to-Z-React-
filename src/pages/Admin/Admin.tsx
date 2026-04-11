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

export default function Admin({ session }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCodes() {
    const { data } = await supabase
      .from("invite_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes(data || []);
  }

  useEffect(() => {
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setIsAdmin(true);
          fetchCodes();
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
      fetchCodes();
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("invite_codes").delete().eq("id", id);
    fetchCodes();
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

      <div className="admin-section">
        <h2>Інвайт коди</h2>

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
