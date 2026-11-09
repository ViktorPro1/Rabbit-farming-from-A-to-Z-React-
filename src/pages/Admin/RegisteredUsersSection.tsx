import type { PlanType, RegisteredUser } from "./types";

interface Props {
  users: RegisteredUser[];
  currentUserId: string;
  onSetPlanType: (userId: string, planType: PlanType) => void;
  onSetAccessUntil: (userId: string, dateValue: string) => void;
  onGrantOneMonth: (userId: string) => void;
  onMakeUnlimited: (userId: string) => void;
  onDelete: (user: RegisteredUser) => void;
}

export function RegisteredUsersSection({
  users,
  currentUserId,
  onSetPlanType,
  onSetAccessUntil,
  onGrantOneMonth,
  onMakeUnlimited,
  onDelete,
}: Props) {
  return (
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
              <th>Тип</th>
              <th>Доступ до</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", opacity: 0.5 }}>
                  Немає користувачів
                </td>
              </tr>
            ) : (
              users.map((user, i) => {
                const isExpired =
                  !!user.access_until &&
                  new Date(user.access_until) < new Date();
                return (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>{user.email}</td>
                    <td className="code-text">{user.invite_code}</td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString("uk-UA")}
                    </td>
                    <td>
                      <select
                        id={`plan-type-${user.id}`}
                        name={`plan-type-${user.id}`}
                        className="access-plan-select"
                        value={user.plan_type}
                        onChange={(e) =>
                          onSetPlanType(user.id, e.target.value as PlanType)
                        }
                      >
                        <option value="trial">Пробний</option>
                        <option value="paid">Платний</option>
                        <option value="founder">Засновник</option>
                        <option value="vip">VIP</option>
                      </select>
                    </td>
                    <td>
                      {user.access_until ? (
                        <span
                          className={`code-status access-status ${isExpired ? "used" : "free"}`}
                          title={new Date(user.access_until).toLocaleString(
                            "uk-UA",
                          )}
                        >
                          {new Date(user.access_until).toLocaleDateString(
                            "uk-UA",
                          )}
                          {isExpired ? " (прострочено)" : ""}
                        </span>
                      ) : (
                        <span className="code-status access-status free">
                          Безстроково
                        </span>
                      )}
                      <div className="access-controls">
                        <input
                          id={`access-until-${user.id}`}
                          name={`access-until-${user.id}`}
                          type="date"
                          className="access-date-input"
                          defaultValue={
                            user.access_until
                              ? user.access_until.slice(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            onSetAccessUntil(user.id, e.target.value)
                          }
                        />
                        <button
                          className="admin-btn-add access-btn-mini"
                          title="Продовжити на 1 місяць від сьогодні"
                          onClick={() => onGrantOneMonth(user.id)}
                        >
                          +1 міс
                        </button>
                        {user.access_until && (
                          <button
                            className="admin-btn-generate access-btn-mini"
                            title="Зробити безстроковим"
                            onClick={() => onMakeUnlimited(user.id)}
                          >
                            ∞
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      {user.id !== currentUserId && (
                        <button
                          className="admin-btn-delete"
                          onClick={() => onDelete(user)}
                        >
                          Видалити
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
