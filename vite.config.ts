import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ВАЖНО для GitHub Pages:
// Если сайт публикуется по адресу https://<логин>.github.io/<имя-репо>/,
// то base должен быть '/<имя-репо>/'.
// Если используете собственный домен, Vercel или репозиторий вида
// <логин>.github.io — оставьте '/'.
export default defineConfig({
  base: "/",
  plugins: [react()],
});
