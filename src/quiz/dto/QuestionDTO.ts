export type AnswerOptionDTO = {
  id: string;
  text: string;
  correct?: boolean;
};

export type QuestionDTO = {
  id: number;
  question: string;
  options: AnswerOptionDTO[];
};

export type QuizDTO = {
  id: number;
  questions: QuestionDTO[];
};
