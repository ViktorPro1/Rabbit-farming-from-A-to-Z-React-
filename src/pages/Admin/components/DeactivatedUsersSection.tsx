import type { DeactivatedUser } from "../types";

interface Props {
  users: DeactivatedUser[];
  onRestore: (user: DeactivatedUser) => void;
}

export function DeactivatedUsersSection({ users, onRestore }: Props) {
  if (users.length === 0) return null;

  return (
    <div className="admin-section">
      <h2>
        🔒 Деактивовані користувачі{" "}
        <span className="admin-count">{users.length}</span>
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
            {users.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="admin-btn-add"
                    onClick={() => onRestore(user)}
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
  );
}
