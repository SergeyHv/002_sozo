// Логотип-монограмма SOZO. Рисуется в коде — нет внешних файлов и вопросов
// о лицензиях. Символика сдержанная: раскрытые руки / чаша, отпускающие
// светлую точку вверх — образ доверия и освобождения. Без изображения людей
// и без попыток «нарисовать» Бога.

interface Props {
  size?: number;
}

export default function BrandMark({ size = 30 }: Props) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* раскрытые ладони / чаша */}
      <path d="M10 26 C10 36 16 40 24 40 C32 40 38 36 38 26" {...common} />
      <path d="M10 26 L7 21" {...common} />
      <path d="M38 26 L41 21" {...common} />
      {/* свет, отпущенный вверх */}
      <circle cx="24" cy="16" r="4" {...common} />
      <path d="M24 9 L24 5" {...common} />
      <path d="M18 12 L15 9" {...common} />
      <path d="M30 12 L33 9" {...common} />
    </svg>
  );
}
