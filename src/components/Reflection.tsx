import { useState } from "react";
import { marked } from "marked";
import type { Reflection as ReflectionType } from "../lib/types";
import {
  getReflectionAnswers,
  saveReflectionAnswer,
  markCompleted,
  isPassed,
} from "../lib/progress";
import AskMentor from "./AskMentor";

interface Props {
  lessonId: string;
  lessonTitle: string;
  reflection: ReflectionType;
}

export default function Reflection({ lessonId, lessonTitle, reflection }: Props) {
  const saved = getReflectionAnswers(lessonId);
  const [answers, setAnswers] = useState<string[]>(
    reflection.prompts.map((_, i) => saved[i] ?? ""),
  );
  const [revealed, setRevealed] = useState<boolean[]>(
    reflection.prompts.map(() => false),
  );
  const [done, setDone] = useState<boolean>(isPassed(lessonId));

  function onType(i: number, text: string) {
    setAnswers((prev) => {
      const next = prev.slice();
      next[i] = text;
      return next;
    });
    saveReflectionAnswer(lessonId, i, text);
  }

  function reveal(i: number) {
    setRevealed((prev) => {
      const next = prev.slice();
      next[i] = true;
      return next;
    });
  }

  const allRevealed = revealed.every(Boolean);

  function complete() {
    markCompleted(lessonId);
    setDone(true);
  }

  return (
    <section className="reflection">
      <div className="qtag">Размышление · самопроверка</div>
      <h2>Подумайте и проверьте себя</h2>
      <p className="reflection-note">
        Здесь нет автоматической оценки — и это намеренно. Сначала напишите свой
        ответ своими словами, затем откройте разбор и честно сравните. Ваши
        записи сохраняются в этом браузере.
      </p>
      {reflection.intro && <p className="reflection-intro">{reflection.intro}</p>}

      {reflection.prompts.map((p, i) => (
        <div className="reflect-item" key={i}>
          <div className="qtext">
            {i + 1}. {p.q}
          </div>
          <textarea
            className="reflect-input"
            value={answers[i]}
            placeholder={p.placeholder ?? "Ваш ответ…"}
            onChange={(e) => onType(i, e.target.value)}
            rows={5}
          />
          {!revealed[i] ? (
            <button className="btn secondary" onClick={() => reveal(i)}>
              Показать разбор
            </button>
          ) : (
            <div className="model-answer">
              <div className="model-label">Разбор для сравнения</div>
              <div
                className="model-text"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(p.model) as string,
                }}
              />
              {p.rubric && p.rubric.length > 0 && (
                <div className="rubric">
                  <div className="rubric-title">Проверьте свой ответ:</div>
                  {p.rubric.map((r, ri) => (
                    <label className="rubric-item" key={ri}>
                      <input type="checkbox" />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
          <AskMentor lessonTitle={lessonTitle} draft={answers[i]} />
        </div>
      ))}

      {done ? (
        <p className="reflect-done">
          ✓ Урок отмечен пройденным. Следующий урок открыт.
        </p>
      ) : (
        <button className="btn" onClick={complete} disabled={!allRevealed}>
          {allRevealed
            ? "Я проработал(а) все задания — отметить урок пройденным"
            : "Откройте разбор по каждому заданию, чтобы продолжить"}
        </button>
      )}
    </section>
  );
}
