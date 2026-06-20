import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/app.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Регистрируем service worker только в собранной (опубликованной) версии,
// чтобы не мешать разработке. Даёт установку на телефон и оффлайн-чтение.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js")
      .catch(() => {
        /* регистрация необязательна — сайт работает и без неё */
      });
  });
}
