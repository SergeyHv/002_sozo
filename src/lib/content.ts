import type { Level, Module, Lesson, Quiz, Reflection, MetaFile } from "./types";

// Vite собирает все файлы контента на этапе сборки.
// Markdown — как сырой текст, JSON — как объекты.
// ВАЖНО: контент лежит в папке src/content, поэтому пути начинаются с /src/content.
const markdownFiles = import.meta.glob("/src/content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const quizFiles = import.meta.glob("/src/content/**/*.quiz.json", {
  eager: true,
}) as Record<string, { default: Quiz }>;

const reflectionFiles = import.meta.glob("/src/content/**/*.reflection.json", {
  eager: true,
}) as Record<string, { default: Reflection }>;

const metaFiles = import.meta.glob("/src/content/**/_meta.json", {
  eager: true,
}) as Record<string, { default: MetaFile }>;

/** Убирает числовой префикс «01-» из сегмента пути. */
function stripOrder(segment: string): string {
  return segment.replace(/^\d+-/, "");
}

/** Достаёт числовой префикс как порядок сортировки. */
function orderOf(segment: string): number {
  const m = segment.match(/^(\d+)-/);
  return m ? parseInt(m[1], 10) : 999;
}

/** Берёт первый H1 как заголовок урока. */
function titleFromMarkdown(md: string, fallback: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

/** Путь вида /src/content/level-1/01-mod/01-lesson.md -> сегменты. */
function segments(path: string): string[] {
  return path.replace(/^\/src\/content\//, "").split("/");
}

function buildContentTree(): Level[] {
  const levels = new Map<string, Level>();
  const modules = new Map<string, Module>();

  // 1. Метаданные уровней и модулей.
  for (const [path, mod] of Object.entries(metaFiles)) {
    const seg = segments(path); // [levelDir, _meta.json] или [levelDir, moduleDir, _meta.json]
    const meta = mod.default;
    if (seg.length === 2) {
      const levelDir = seg[0];
      levels.set(levelDir, {
        id: stripOrder(levelDir),
        title: meta.title ?? stripOrder(levelDir),
        description: meta.description,
        audience: meta.audience,
        order: orderOf(levelDir),
        modules: [],
      });
    } else if (seg.length === 3) {
      const [levelDir, moduleDir] = seg;
      const id = `${stripOrder(levelDir)}/${stripOrder(moduleDir)}`;
      modules.set(`${levelDir}/${moduleDir}`, {
        id,
        title: meta.title ?? stripOrder(moduleDir),
        description: meta.description,
        order: orderOf(moduleDir),
        levelId: stripOrder(levelDir),
        lessons: [],
      });
    }
  }

  // 2. Уроки.
  for (const [path, md] of Object.entries(markdownFiles)) {
    const seg = segments(path); // [levelDir, moduleDir, file.md]
    if (seg.length !== 3) continue;
    const [levelDir, moduleDir, file] = seg;
    const slug = stripOrder(file.replace(/\.md$/, ""));
    const levelId = stripOrder(levelDir);
    const moduleId = `${levelId}/${stripOrder(moduleDir)}`;
    const lessonId = `${moduleId}/${slug}`;

    // Сопоставляем тест и размышление по соседним файлам.
    const quizPath = path.replace(/\.md$/, ".quiz.json");
    const reflectionPath = path.replace(/\.md$/, ".reflection.json");
    const quiz = quizFiles[quizPath]?.default;
    const reflection = reflectionFiles[reflectionPath]?.default;

    const lesson: Lesson = {
      id: lessonId,
      title: titleFromMarkdown(md, slug),
      markdown: md,
      quiz,
      reflection,
      order: orderOf(file),
      moduleId,
      levelId,
    };

    const moduleKey = `${levelDir}/${moduleDir}`;
    const module = modules.get(moduleKey);
    if (module) module.lessons.push(lesson);
  }

  // 3. Сборка дерева с сортировкой.
  for (const [key, module] of modules) {
    module.lessons.sort((a, b) => a.order - b.order);
    const levelDir = key.split("/")[0];
    const level = levels.get(levelDir);
    if (level) level.modules.push(module);
  }
  for (const level of levels.values()) {
    level.modules.sort((a, b) => a.order - b.order);
  }

  return Array.from(levels.values()).sort((a, b) => a.order - b.order);
}

export const levels: Level[] = buildContentTree();

/** Плоская последовательность всех уроков — основа для строгой блокировки. */
export const lessonSequence: Lesson[] = levels.flatMap((level) =>
  level.modules.flatMap((m) => m.lessons),
);

const lessonById = new Map(lessonSequence.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson | undefined {
  return lessonById.get(id);
}

export function lessonIndex(id: string): number {
  return lessonSequence.findIndex((l) => l.id === id);
}
