import { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { marked } from "marked";
import { getLesson, lessonSequence, lessonIndex, levels } from "../lib/content";
import { isUnlocked, isPassed, markCompleted } from "../lib/progress";
import { useProgress } from "../lib/useProgress";
import Quiz from "./Quiz";
import Reflection from "./Reflection";

marked.setOptions({ breaks: false, gfm: true });

export default function LessonView() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  useProgress(); // перерисовка при изменении прогресса

  const lesson = lessonId ? getLesson(decodeURIComponent(lessonId)) : undefined;

  const html = useMemo(
    () => (lesson ? marked.parse(lesson.markdown) : ""),
    [lesson],
  );

  // При переходе на другой урок прокручиваем страницу наверх
  // и обновляем заголовок вкладки браузера.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (lesson) document.title = `${lesson.title} · SOZO`;
    return () => {
      document.title = "SOZO · путь к свободе от созависимости";
    };
  }, [lesson?.id]);

  // Урок без теста И без размышления считается пройденным по факту открытия.
  useEffect(() => {
    if (lesson && !lesson.quiz && !lesson.reflection && isUnlocked(lesson.id)) {
      markCompleted(lesson.id);
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div>
        <p>Урок не найден.</p>
        <Link to="/">← К списку шагов</Link>
      </div>
    );
  }

  const unlocked = isUnlocked(lesson.id);
  const idx = lessonIndex(lesson.id);
  const prev = idx > 0 ? lessonSequence[idx - 1] : undefined;
  const next = idx < lessonSequence.length - 1 ? lessonSequence[idx + 1] : undefined;
  const nextUnlocked = next ? isPassed(lesson.id) : false;

  const level = levels.find((l) => l.id === lesson.levelId);
  const module = level?.modules.find((m) => m.id === lesson.moduleId);

  if (!unlocked) {
    return (
      <div>
        <div className="crumbs">
          <Link to="/">Шаги</Link> · {level?.title} · {module?.title}
        </div>
        <h1>{lesson.title}</h1>
        <div className="note-locked">
          Этот урок пока закрыт. Чтобы открыть его, завершите предыдущий урок
          {prev && (
            <>
              {" "}
              — <Link to={`/lesson/${encodeURIComponent(prev.id)}`}>{prev.title}</Link>.
            </>
          )}
        </div>
      </div>
    );
  }

  // Ключ на всю область урока: при смене урока React гарантированно
  // убирает прежнее содержимое (тест/размышление) и строит новое.
  return (
    <div key={lesson.id}>
      <div className="lesson-top">
        <div className="crumbs">
          <Link to="/">Шаги</Link> · {level?.title} · {module?.title}
        </div>
        <button
          className="print-btn linklike"
          onClick={() => window.print()}
          title="Распечатать или сохранить урок в PDF"
        >
          Печать / PDF
        </button>
      </div>

      <article
        className="lesson-body"
        dangerouslySetInnerHTML={{ __html: html as string }}
      />

      {lesson.quiz && (
        <Quiz key={lesson.id + "-quiz"} lessonId={lesson.id} quiz={lesson.quiz} />
      )}

      {lesson.reflection && (
        <Reflection
          key={lesson.id + "-reflection"}
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          reflection={lesson.reflection}
        />
      )}

      <nav className="lesson-nav">
        {prev ? (
          <Link
            className="btn secondary"
            to={`/lesson/${encodeURIComponent(prev.id)}`}
          >
            ← {prev.title}
          </Link>
        ) : (
          <Link className="btn secondary" to="/">
            ← К шагам
          </Link>
        )}

        {next &&
          (nextUnlocked ? (
            <button
              className="btn"
              onClick={() => navigate(`/lesson/${encodeURIComponent(next.id)}`)}
            >
              {next.title} →
            </button>
          ) : (
            <button className="btn" disabled title="Завершите урок, чтобы продолжить">
              Дальше после задания →
            </button>
          ))}
      </nav>
    </div>
  );
}
