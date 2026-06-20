// Типы данных платформы SOZO.

export type QuestionType = "single" | "multiple" | "boolean";

export interface QuizQuestion {
  /** Тип вопроса: один ответ, несколько ответов или верно/неверно. */
  type: QuestionType;
  /** Текст вопроса. */
  q: string;
  /** Варианты ответа. Для boolean — необязательно (по умолчанию «Верно»/«Неверно»). */
  options?: string[];
  /**
   * Правильный ответ.
   * single  — индекс варианта (number)
   * multiple — массив индексов (number[])
   * boolean — true / false
   */
  answer: number | number[] | boolean;
  /** Необязательное пояснение, показывается после ответа. */
  explanation?: string;
}

export interface Quiz {
  /** Проходной балл в процентах (например, 80). */
  passing_score: number;
  questions: QuizQuestion[];
}

/** Одно задание на размышление с самопроверкой по эталону. */
export interface ReflectionPrompt {
  /** Текст задания/вопроса. */
  q: string;
  /** Подсказка в поле ввода (необязательно). */
  placeholder?: string;
  /** Эталонный разбор (Markdown), который открывается после ответа студента. */
  model: string;
  /** Критерии для самопроверки (необязательно). */
  rubric?: string[];
}

export interface Reflection {
  /** Необязательное вступление к блоку размышления. */
  intro?: string;
  prompts: ReflectionPrompt[];
}

export interface Lesson {
  /** Уникальный идентификатор: level/module/lesson-slug. */
  id: string;
  /** Заголовок (берётся из первого H1 в Markdown). */
  title: string;
  /** Сырой Markdown-текст урока. */
  markdown: string;
  /** Тест урока (автопроверка), если есть. */
  quiz?: Quiz;
  /** Блок размышления с самопроверкой, если есть. */
  reflection?: Reflection;
  /** Порядковый номер внутри модуля (из префикса имени файла). */
  order: number;
  /** Идентификатор модуля-родителя. */
  moduleId: string;
  /** Идентификатор уровня-родителя. */
  levelId: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  levelId: string;
  lessons: Lesson[];
}

export interface Level {
  id: string;
  title: string;
  description?: string;
  /** Подпись к уровню, напр. «Если вы теряете себя в близких отношениях». */
  audience?: string;
  order: number;
  modules: Module[];
}

export interface MetaFile {
  title?: string;
  description?: string;
  audience?: string;
}
