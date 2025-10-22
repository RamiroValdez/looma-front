import type { QuestionDTO, QuizDTO } from '../dto/QuestionDTO';
import { pools } from './questionPools';

const difficulties: Array<'muy facil'|'facil'|'medio'|'dificil'|'avanzado'> = ['muy facil','facil','medio','dificil','avanzado'];

function sampleOne(arr: QuestionDTO[]): QuestionDTO | undefined {
  if (!arr || arr.length === 0) return undefined;
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
}

export function buildQuizFromPools(): QuizDTO {
  const questions: QuestionDTO[] = [];
  for (const diff of difficulties) {
    const pool = pools[diff] ?? [];
    const q = sampleOne(pool);
    if (q) questions.push(q as QuestionDTO);
  }
  return { id: Date.now(), questions };
}

export default buildQuizFromPools;
