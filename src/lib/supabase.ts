import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./supabaseConfig";

// Включена ли синхронизация с сервером. Если в supabaseConfig не заполнены
// url/key или enabled = false — сайт работает локально (прогресс в браузере),
// а весь сетевой код просто не запускается.
export const authEnabled =
  supabaseConfig.enabled && !!supabaseConfig.url && !!supabaseConfig.publishableKey;

// Клиент создаём всегда (с безопасной заглушкой, если синхронизация выключена),
// чтобы остальной код не падал на проверках на null. Сетевые вызовы при
// authEnabled === false не делаются.
const url = supabaseConfig.url || "https://placeholder.supabase.co";
const key = supabaseConfig.publishableKey || "placeholder-anon-key";

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "implicit",
  },
});
