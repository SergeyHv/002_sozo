import { useEffect } from "react";
import { Link } from "react-router-dom";
import { levels } from "../lib/content";
import { isUnlocked, isPassed, getResult } from "../lib/progress";
import { useProgress } from "../lib/useProgress";
import LevelEmblem from "./LevelEmblem";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

export default function Home() {
  useProgress();

  useEffect(() => {
    document.title = "SOZO · путь к свободе от созависимости";
  }, []);

  return (
    <div>
      <p className="lead">
        Этот путь — для тех, кто в близких отношениях постепенно теряет себя:
        живёт чужой жизнью, спасает и контролирует, тревожится и винит себя.
        Шаг за шагом: понять, что такое созависимость, научиться здоровым
        границам и обрести свободу через доверие Богу.
      </p>

      <div className="sozo-meaning">
        <span className="sozo-word">σώζω · sōzō</span>
        <p>
          Греческое слово из Нового Завета. Им названо и спасение, и исцеление,
          и избавление, и возвращение к целостности. Одно слово — о том, что
          Бог делает с человеком целиком: «вера твоя спасла тебя» (Лк. 7:50).
        </p>
      </div>

      {levels.map((level, li) => (
        <section className="level-card" key={level.id}>
          <div className="level-card-head">
            <span className="level-emblem">
              <LevelEmblem level={li + 1} />
            </span>
            <div>
              <span className="level-num">Шаг {ROMAN[li + 1]}</span>
              <h2>{level.title}</h2>
              {(() => {
                const lessons = level.modules.flatMap((m) => m.lessons);
                const done = lessons.length > 0 && lessons.every((l) => isPassed(l.id));
                return done ? (
                  <div className="step-badge">✓ Шаг пройден</div>
                ) : (
                  level.audience && <div className="audience">{level.audience}</div>
                );
              })()}
            </div>
          </div>
          {level.description && <p className="desc">{level.description}</p>}

          {level.modules.map((module) => (
            <div className="module" key={module.id}>
              <h3>{module.title}</h3>
              {module.description && <p className="mdesc">{module.description}</p>}
              <ul className="lesson-list">
                {module.lessons.map((lesson) => {
                  const unlocked = isUnlocked(lesson.id);
                  const passed = isPassed(lesson.id);
                  const res = getResult(lesson.id);
                  const cls = `lesson-row ${passed ? "passed" : ""} ${
                    unlocked ? "" : "locked"
                  }`;
                  const inner = (
                    <>
                      <span className="marker">
                        {passed ? "✓" : unlocked ? "○" : "🔒"}
                      </span>
                      <span className="ltitle">{lesson.title}</span>
                      {res && (
                        <span className="score">
                          {res.passed ? `пройден · ${res.score}%` : `${res.score}%`}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li className={cls} key={lesson.id}>
                      {unlocked ? (
                        <Link
                          to={`/lesson/${encodeURIComponent(lesson.id)}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            flex: 1,
                            color: "inherit",
                          }}
                        >
                          {inner}
                        </Link>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
