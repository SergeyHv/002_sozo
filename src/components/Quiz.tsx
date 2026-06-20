import { useState } from "react";
import type { Quiz as QuizType, QuizQuestion } from "../lib/types";
import { saveResult } from "../lib/progress";

interface Props {
  lessonId: string;
  quiz: QuizType;
}

type Selection = number[]; // выбранные индексы (для boolean: 0=Верно,1=Неверно)

function boolOptions(): string[] {
  return ["Верно", "Неверно"];
}

function correctIndices(q: QuizQuestion): number[] {
  if (q.type === "boolean") return [q.answer === true ? 0 : 1];
  if (q.type === "multiple") return (q.answer as number[]).slice().sort();
  return [q.answer as number];
}

function isQuestionCorrect(q: QuizQuestion, sel: Selection): boolean {
  const correct = correctIndices(q);
  const chosen = sel.slice().sort();
  return (
    correct.length === chosen.length && correct.every((v, i) => v === chosen[i])
  );
}

export default function Quiz({ lessonId, quiz }: Props) {
  const [answers, setAnswers] = useState<Selection[]>(
    quiz.questions.map(() => []),
  );
  const [submitted, setSubmitted] = useState(false);

  function toggle(qi: number, oi: number, multiple: boolean) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = prev.map((a) => a.slice());
      if (multiple) {
        const at = next[qi].indexOf(oi);
        if (at >= 0) next[qi].splice(at, 1);
        else next[qi].push(oi);
      } else {
        next[qi] = [oi];
      }
      return next;
    });
  }

  const allAnswered = answers.every((a) => a.length > 0);
  const correctCount = quiz.questions.filter((q, i) =>
    isQuestionCorrect(q, answers[i]),
  ).length;
  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passing_score;

  function submit() {
    setSubmitted(true);
    saveResult(lessonId, score, quiz.passing_score);
  }

  function retry() {
    setAnswers(quiz.questions.map(() => []));
    setSubmitted(false);
  }

  return (
    <section className="quiz">
      <div className="qtag">Проверка · проходной балл {quiz.passing_score}%</div>
      <h2>Тест по уроку</h2>

      {quiz.questions.map((q, qi) => {
        const options = q.options ?? boolOptions();
        const multiple = q.type === "multiple";
        const correct = correctIndices(q);
        return (
          <div className="question" key={qi}>
            <div className="qtext">
              {qi + 1}. {q.q}
              {multiple && (
                <span style={{ color: "var(--ink-faint)", fontSize: 14 }}>
                  {"  "}(выберите все верные)
                </span>
              )}
            </div>
            {options.map((opt, oi) => {
              const selected = answers[qi].includes(oi);
              let cls = "option";
              if (submitted) {
                if (correct.includes(oi)) cls += " correct";
                else if (selected) cls += " wrong";
              } else if (selected) {
                cls += " selected";
              }
              return (
                <label className={cls} key={oi}>
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    name={`q-${qi}`}
                    checked={selected}
                    disabled={submitted}
                    onChange={() => toggle(qi, oi, multiple)}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
            {submitted && q.explanation && (
              <div className="explanation">
                <b>Пояснение.</b> {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button className="btn" onClick={submit} disabled={!allAnswered}>
          {allAnswered ? "Проверить ответы" : "Ответьте на все вопросы"}
        </button>
      ) : (
        <div className="quiz-result">
          <div className="score-big">{score}%</div>
          <p className={`verdict ${passed ? "pass" : "fail"}`}>
            {passed
              ? "Тест сдан — следующий урок открыт."
              : `Нужно набрать ${quiz.passing_score}%. Повторите материал и попробуйте снова.`}
          </p>
          <button className="btn secondary" onClick={retry}>
            Пройти ещё раз
          </button>
        </div>
      )}
    </section>
  );
}
