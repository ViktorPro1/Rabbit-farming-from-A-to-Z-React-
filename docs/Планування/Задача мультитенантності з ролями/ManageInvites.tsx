import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import { useOrganization } from "../../hooks/useOrganization";
import type { OrgRole } from "../../hooks/useOrganization";
import "./ManageInvites.css";

interface InviteCode {
  id: string;
  code: string;
  role: OrgRole;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

const ROLE_LABELS: Record<OrgRole, string> = {
  owner: "Власник",
  worker: "Робітник",
  accountant: "Бухгалтер",
  vet: "Ветлікар",
};

function generateCode(): string {
  return crypto.randomUUID().split("-")[0].toUpperCase();
}

export default function ManageInvites() {
  const { organizationId, role, loading: orgLoading } = useOrganization();
  const [invites, setInvites] = useState<InviteCode[]>([]);
  const [selectedRole, setSelectedRole] = useState<OrgRole>("worker");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingInvites, setIsLoadingInvites] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
    if (!organizationId) return;
    setIsLoadingInvites(true);
    try {
      const { data, error } = await supabase
        .from("invite_codes")
        .select("id, code, role, used_by, used_at, created_at")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvites(data ?? []);
    } catch (error) {
      logError("ManageInvites:fetchInvites", error);
    } finally {
      setIsLoadingInvites(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleCreate = async () => {
    if (!organizationId) return;
    setErrorMessage(null);
    setIsCreating(true);
    try {
      const { error } = await supabase.from("invite_codes").insert({
        code: generateCode(),
        organization_id: organizationId,
        role: selectedRole,
      });

      if (error) throw error;
      await fetchInvites();
    } catch (error) {
      logError("ManageInvites:handleCreate", error);
      setErrorMessage("Не вдалося створити код. Спробуйте ще раз.");
    } finally {
      setIsCreating(false);
    }
  };

  if (orgLoading) {
    return <p className="manage-invites__status">Завантаження...</p>;
  }

  if (role !== "owner") {
    return (
      <p className="manage-invites__status">
        Ця сторінка доступна лише власнику ферми.
      </p>
    );
  }

  return (
    <div className="manage-invites">
      <h1 className="manage-invites__title">Запрошення учасників</h1>

      <div className="manage-invites__create">
        <select
          className="manage-invites__select"
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value as OrgRole)}
          disabled={isCreating}
        >
          {(Object.keys(ROLE_LABELS) as OrgRole[])
            .filter((r) => r !== "owner")
            .map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
        </select>
        <button
          className="manage-invites__create-button"
          onClick={handleCreate}
          disabled={isCreating}
        >
          {isCreating ? "Створення..." : "Створити код"}
        </button>
      </div>

      {errorMessage && (
        <p className="manage-invites__error">{errorMessage}</p>
      )}

      <table className="manage-invites__table">
        <thead>
          <tr>
            <th>Код</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Створено</th>
          </tr>
        </thead>
        <tbody>
          {isLoadingInvites ? (
            <tr>
              <td colSpan={4}>Завантаження...</td>
            </tr>
          ) : invites.length === 0 ? (
            <tr>
              <td colSpan={4}>Кодів ще немає</td>
            </tr>
          ) : (
            invites.map((invite) => (
              <tr key={invite.id}>
                <td>{invite.code}</td>
                <td>{ROLE_LABELS[invite.role]}</td>
                <td>
                  {invite.used_at
                    ? `Використано ${new Date(
                        invite.used_at
                      ).toLocaleDateString("uk-UA")}`
                    : "Активний"}
                </td>
                <td>
                  {new Date(invite.created_at).toLocaleDateString("uk-UA")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
