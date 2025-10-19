import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMockQuiz } from '../services/mockQuizService';
import type { QuizDTO, QuestionDTO } from '../dto/QuestionDTO';

export function useQuiz() {
  const [quiz, setQuiz] = useState<QuizDTO | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const q = await fetchMockQuiz();
      setQuiz(q);
    })();
  }, []);

  const onSelect = useCallback((optId: string, q: QuestionDTO) => {
    if (disabled) return;
    setSelected(optId);
    setDisabled(true);
    const chosen = q.options.find(o => o.id === optId);
    if (chosen?.correct) {
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const next = prev + 1;
          if (quiz && next < quiz.questions.length) {
            setSelected(null);
            setDisabled(false);
            return next;
          }
          navigate('/quiz/correct');
          return prev;
        });
      }, 700);
    } else {
      const correctOpt = q.options.find(o => o.correct);
      const selectedOpt = q.options.find(o => o.id === optId);
      const statePayload = {
        selectedOption: selectedOpt ? { id: selectedOpt.id, text: selectedOpt.text } : undefined,
        correctOption: correctOpt ? { id: correctOpt.id, text: correctOpt.text } : undefined,
        questionId: q.id,
      };
      setTimeout(() => navigate('/quiz/incorrect', { state: statePayload }), 700);
    }
  }, [disabled, navigate, quiz]);

  return {
    quiz,
    currentIndex,
    selected,
    disabled,
    onSelect,
    setCurrentIndex,
  } as const;
}
