import { useState } from "react";
import { supabase, authEnabled } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";
import { deleteMyData } from "../lib/sync";

const wrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
  fontSize: 14,
  color: "var(--ink-soft, #4a5468)",
  padding: "8px 0 0",
};
const input: React.CSSProperties = {
  font: "inherit",
  fontSize: 14,
  padding: "6px 10px",
  border: "1px solid var(--line, #d7deea)",
  borderRadius: 4,
  background: "#fff",
  color: "var(--ink, #1e2633)",
};
const btn: React.CSSProperties = {
  font: "inherit",
  fontSize: 14,
  padding: "6px 14px",
  border: "none",
  borderRadius: 4,
  background: "var(--accent, #3b4d71)",
  color: "#fff",
  cursor: "pointer",
};
const link: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--accent, #3b4d71)",
  cursor: "pointer",
  font: "inherit",
  padding: 0,
  textDecoration: "underline",
};
const linkDanger: React.CSSProperties = {
  ...link,
  color: "var(--accent-deep, #2c3b59)",
};

export default function AccountBar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");

  // Синхронизация не настроена — панель входа не показываем вовсе.
  if (!authEnabled) return null;

  if (loading) {
    return <div style={wrap}>…</div>;
  }

  if (user) {
    return (
      <div style={{ ...wrap, flexDirection: "column", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span>
            Вы вошли: <b>{user.email}</b> · прогресс сохраняется в вашем аккаунте
          </span>
          <button style={link} onClick={() => supabase.auth.signOut()}>
            Выйти
          </button>
          <button
            style={linkDanger}
            onClick={async () => {
              const ok = confirm(
                "Удалить весь ваш прогресс обучения с сервера и с этого устройства? Это действие необратимо. (Сам вход по email останется; чтобы полностью удалить учётную запись, обратитесь к администратору.)",
              );
              if (!ok) return;
              setBusy(true);
              const res = await deleteMyData();
              setBusy(false);
              if (res.ok) {
                await supabase.auth.signOut();
                alert("Ваши данные удалены.");
              } else {
                alert("Не удалось удалить данные: " + res.error);
              }
            }}
            disabled={busy}
          >
            {busy ? "Удаление…" : "Удалить мои данные"}
          </button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <div style={wrap}>
        <button style={link} onClick={() => setOpen(true)}>
          Войти, чтобы сохранять прогресс
        </button>
      </div>
    );
  }

  async function sendLink() {
    const e = email.trim();
    if (!e) return;
    setBusy(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: e,
      options: {
        emailRedirectTo: window.location.origin + "/",
      },
    });
    setBusy(false);
    if (error) {
      setMsg("Не получилось отправить письмо: " + error.message);
      return;
    }
    setSent(true);
    setMsg(
      "Письмо со ссылкой для входа отправлено. Откройте письмо НА ЭТОМ ЖЕ устройстве и нажмите ссылку — вы вернётесь сюда уже вошедшими. Проверьте папку «Спам».",
    );
  }

  return (
    <div style={{ ...wrap, flexDirection: "column", alignItems: "flex-end" }}>
      {!sent && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={input}
            type="email"
            placeholder="ваша почта"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <button style={btn} onClick={sendLink} disabled={busy}>
            {busy ? "Отправка…" : "Получить ссылку для входа"}
          </button>
          <button
            style={link}
            onClick={() => {
              setOpen(false);
              setMsg("");
            }}
          >
            отмена
          </button>
        </div>
      )}
      {msg && (
        <div style={{ fontSize: 13, color: "var(--ink-faint, #8089a0)", maxWidth: 380 }}>
          {msg}
        </div>
      )}
      <div style={{ fontSize: 12, color: "var(--ink-faint, #8089a0)", maxWidth: 380, marginTop: 4 }}>
        Входя, вы соглашаетесь, что мы храним вашу почту и прогресс обучения. Для
        несовершеннолетних — с согласия родителей.
      </div>
    </div>
  );
}
