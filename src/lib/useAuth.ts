import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, authEnabled } from "./supabase";

/** Реактивно отдаёт текущую сессию и пользователя (или null, если не вошёл). */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(authEnabled);

  useEffect(() => {
    // Синхронизация выключена — не обращаемся к серверу.
    if (!authEnabled) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;
  return { session, user, loading };
}
