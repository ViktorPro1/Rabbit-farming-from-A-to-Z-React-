import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { logError } from "../lib/logError";

export type OrgRole = "owner" | "worker" | "accountant" | "vet";

interface OrganizationState {
  organizationId: string | null;
  role: OrgRole | null;
  loading: boolean;
  hasMembership: boolean;
  refresh: () => void;
}

/**
 * Завантажує organization_id і role поточного користувача з таблиці
 * memberships. Автоматично перезавантажує дані при зміні стану авторизації
 * (логін/логаут) і надає refresh() для ручного оновлення (наприклад одразу
 * після активації інвайт-коду).
 */
export function useOrganization(): OrganizationState {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [role, setRole] = useState<OrgRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    let isMounted = true;

    const loadMembership = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) {
            setOrganizationId(null);
            setRole(null);
          }
          return;
        }

        const { data, error } = await supabase
          .from("memberships")
          .select("organization_id, role")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (isMounted) {
          setOrganizationId(data?.organization_id ?? null);
          setRole((data?.role as OrgRole | undefined) ?? null);
        }
      } catch (error) {
        logError("useOrganization", error);
        if (isMounted) {
          setOrganizationId(null);
          setRole(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMembership();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadMembership();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return {
    organizationId,
    role,
    loading,
    hasMembership: organizationId !== null,
    refresh,
  };
}
