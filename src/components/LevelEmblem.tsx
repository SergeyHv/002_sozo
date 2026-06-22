// Тонкие линейные SVG-символы для шагов пути SOZO. Рисуются прямо в коде:
// нет внешних файлов, нет вопросов о лицензиях. Сдержанная символика,
// без изображения людей и без попыток «нарисовать» Бога.

interface Props {
  /** Номер шага (1..3). */
  level: number;
  size?: number;
}

const stroke = "currentColor";
const common = {
  fill: "none",
  stroke,
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function LevelEmblem({ level, size = 44 }: Props) {
  const box = 48;
  const p = { width: size, height: size, viewBox: `0 0 ${box} ${box}` };

  switch (level) {
    // Шаг 1 — Понять: лупа, рассматривающая сплетение (две перекрытые
    // окружности внутри линзы) — различить, где «я», а где «другой».
    case 1:
      return (
        <svg {...p} aria-hidden="true">
          <circle cx="20" cy="19" r="11" {...common} />
          <line x1="28" y1="27" x2="38" y2="37" {...common} />
          <circle cx="16.5" cy="19" r="4.2" {...common} />
          <circle cx="23.5" cy="19" r="4.2" {...common} />
        </svg>
      );
    // Шаг 2 — Границы: забор — рейка и столбики (где заканчиваюсь я
    // и начинается другой).
    case 2:
      return (
        <svg {...p} aria-hidden="true">
          <line x1="8" y1="22" x2="40" y2="22" {...common} />
          <line x1="14" y1="12" x2="14" y2="34" {...common} />
          <line x1="24" y1="9" x2="24" y2="37" {...common} />
          <line x1="34" y1="12" x2="34" y2="34" {...common} />
        </svg>
      );
    // Шаг 3 — Свобода: две птицы в полёте (отпустить и довериться Богу).
    case 3:
      return (
        <svg {...p} aria-hidden="true">
          <path d="M6 28 C13 20 19 26 24 22 C29 26 35 20 42 28" {...common} />
          <path d="M11 33 C16 28 20 32 24 29 C28 32 32 28 37 33" {...common} />
        </svg>
      );
    default:
      return (
        <svg {...p} aria-hidden="true">
          <circle cx="24" cy="24" r="10" {...common} />
        </svg>
      );
  }
}
