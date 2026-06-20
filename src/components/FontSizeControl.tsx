import { useEffect, useState } from "react";

const KEY = "sozo:fontsize:v1";
const SIZES = ["normal", "large", "xlarge"] as const;
type Size = (typeof SIZES)[number];

function apply(s: Size): void {
  document.body.classList.remove("fs-large", "fs-xlarge");
  if (s === "large") document.body.classList.add("fs-large");
  if (s === "xlarge") document.body.classList.add("fs-xlarge");
}

/** Переключатель размера текста для удобства чтения. Выбор сохраняется. */
export default function FontSizeControl() {
  const [size, setSize] = useState<Size>("normal");

  useEffect(() => {
    let saved: Size = "normal";
    try {
      const v = localStorage.getItem(KEY);
      if (v === "large" || v === "xlarge") saved = v;
    } catch {
      /* ignore */
    }
    setSize(saved);
    apply(saved);
  }, []);

  function choose(s: Size) {
    setSize(s);
    apply(s);
    try {
      localStorage.setItem(KEY, s);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="a11y-bar" role="group" aria-label="Размер текста">
      <span aria-hidden="true">Размер текста:</span>
      <button
        className={size === "normal" ? "active" : ""}
        style={{ fontSize: 13 }}
        onClick={() => choose("normal")}
        aria-label="Обычный размер текста"
        aria-pressed={size === "normal"}
      >
        А
      </button>
      <button
        className={size === "large" ? "active" : ""}
        style={{ fontSize: 16 }}
        onClick={() => choose("large")}
        aria-label="Крупный текст"
        aria-pressed={size === "large"}
      >
        А
      </button>
      <button
        className={size === "xlarge" ? "active" : ""}
        style={{ fontSize: 19 }}
        onClick={() => choose("xlarge")}
        aria-label="Очень крупный текст"
        aria-pressed={size === "xlarge"}
      >
        А
      </button>
    </div>
  );
}
