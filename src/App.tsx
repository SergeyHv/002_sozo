import { useEffect } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import LessonView from "./components/LessonView";
import About from "./components/About";
import Help from "./components/Help";
import FirstStep from "./components/FirstStep";
import AccountBar from "./components/AccountBar";
import BrandMark from "./components/BrandMark";
import FontSizeControl from "./components/FontSizeControl";
import { supabase, authEnabled } from "./lib/supabase";
import { initSync } from "./lib/sync";
import { overallProgress, resetProgress } from "./lib/progress";
import { useProgress } from "./lib/useProgress";

function Header() {
  useProgress();
  const pct = Math.round(overallProgress() * 100);
  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/" className="brand-link">
          <span className="brand-logo">
            <BrandMark />
          </span>
          <span className="brand-text">
            SOZO
            <small>путь к свободе от созависимости · Ковчег спасения</small>
          </span>
        </Link>
      </div>
      <div className="header-progress">
        Пройдено {pct}%
        <div className="bar">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-links">
        <Link to="/about">О курсе</Link>
        <Link to="/first-step">Первый шаг к Богу</Link>
        <Link to="/help" className="footer-help">
          Если вам тяжело
        </Link>
        <button
          className="linklike"
          onClick={() => {
            if (confirm("Сбросить весь прогресс обучения?")) resetProgress();
          }}
        >
          Сбросить прогресс
        </button>
      </nav>
      <FontSizeControl />
      <span className="footer-mark">SOZO · Ковчег спасения</span>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    // Синхронизация запускается только если она настроена (см. supabaseConfig).
    if (!authEnabled) return;

    initSync();

    // После входа по ссылке аккуратно возвращаем человека на главную.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !window.location.hash.startsWith("#/")) {
        window.location.hash = "#/";
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <HashRouter>
      <div className="app">
        <AccountBar />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:lessonId" element={<LessonView />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/first-step" element={<FirstStep />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}
