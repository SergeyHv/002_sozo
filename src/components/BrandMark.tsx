// Логотип-монограмма SOZO. Рисуется в коде — нет внешних файлов и вопросов
// о лицензиях. Сдержанная серифная буква «S» на фирменном бейдже
// (фон и скругление задаёт CSS-класс .brand-logo). Тот же знак — в favicon
// и в OG-картинке, для единства бренда.

interface Props {
  size?: number;
}

export default function BrandMark({ size = 30 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight={700}
        fontSize={36}
        fill="currentColor"
      >
        S
      </text>
    </svg>
  );
}
