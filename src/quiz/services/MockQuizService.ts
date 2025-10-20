import type { QuizDTO } from '../dto/QuestionDTO';
import { buildQuizFromPools } from './quizBuilder';

export const fetchMockQuiz = async (): Promise<QuizDTO> => {
  await new Promise((r) => setTimeout(r, 250));
  return buildQuizFromPools();
};
