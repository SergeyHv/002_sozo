import { useEffect, useState } from "react";

const COUNTER_URL = "https://api.counterapi.dev/v1/sozo002/views";

export default function ViewCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${COUNTER_URL}/up`)
      .then((r) => r.json())
      .then((data) => setCount(data.count))
      .catch(() => {
        fetch(COUNTER_URL)
          .then((r) => r.json())
          .then((data) => setCount(data.count))
          .catch(() => {});
      });
  }, []);

  if (count === null) return null;

  return (
    <span className="view-counter">
      Просмотров: {count.toLocaleString("ru-RU")}
    </span>
  );
}
