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
    // Шаг 1 — Понять: два пересекающихся круга (сплетённые жизни, которые
    // нужно различить — где «я», а где «другой»).
    case 1:
      return (
        <svg {...p} aria-hidden="true">
          <circle cx="19" cy="24" r="11" {...common} />
          <circle cx="29" cy="24" r="11" {...common} />
        </svg>
      );
    // Шаг 2 — Границы: порог/линия между двумя пространствами (где
    // заканчиваюсь я и начинается другой).
    case 2:
      return (
        <svg {...p} aria-hidden="true">
          <line x1="24" y1="8" x2="24" y2="40" {...common} />
          <path d="M16 16 H9 V32 H16" {...common} />
          <path d="M32 16 H39 V32 H32" {...common} />
        </svg>
      );
    // Шаг 3 — Свобода: раскрытая ладонь, отпускающая свет вверх
    // (доверить близкого Богу).
    case 3:
      return (
        <svg {...p} aria-hidden="true">
          <path
            d="M14 40 C12 32 13 26 16 26 C18 26 18 29 18 31 V20 C18 18 21 18 21 20 V29 C21 27 21 25 24 25 C26 25 26 27 26 29 V31 C26 28 27 27 29 28 C32 30 32 36 31 40 Z"
            {...common}
          />
          <circle cx="24" cy="11" r="3.5" {...common} />
          <line x1="24" y1="4" x2="24" y2="6" {...common} />
          <line x1="17" y1="7" x2="18.5" y2="8.5" {...common} />
          <line x1="31" y1="7" x2="29.5" y2="8.5" {...common} />
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
