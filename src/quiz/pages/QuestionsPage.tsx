import Background from '../components/Background';
import AnswerOption from '../components/AnswerOption';
import { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/UseQuiz';
import LayeredCard from '../components/LayeredCard';
import Button from '../../components/Button';

export default function QuestionsPage() {
    const { quiz, currentIndex, disabled, onSelect } = useQuiz();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedId(null);
    }, [currentIndex]);

    if (!quiz) return <Background><div className="p-6">Cargando...</div></Background>;

    const q = quiz.questions[currentIndex];

    const letters = ['A', 'B', 'C', 'D'];

    const handleNext = () => {
        if (!selectedId) return;
        onSelect(selectedId, q);
    };

    return (
        <Background>
            <div className="max-w-2xl mx-auto mt-8">
                <LayeredCard
                    topContent={
                        <div className="bg-white rounded-md px-6 py-3 shadow-md text-center">
                            <div className="text-3xl font-bold text-[#5C17A6]">Pregunta {currentIndex + 1}</div>
                            <div className="mt-2">
                                <h1 className="text-xl font-semibold text-[#000000]">
                                    {q.question}
                                </h1>
                            </div>
                        </div>
                    }
                >
                    <div className="mx-auto w-[80%]">
                        {q.options.map((opt, idx) => {
                            const isSelected = selectedId === opt.id;
                            const variant = isSelected ? 'selected' : 'default';
                            const letter = letters[idx] ?? '';
                            return (
                                <AnswerOption
                                    key={opt.id}
                                    letter={letter}
                                    text={opt.text}
                                    onClick={() => setSelectedId(opt.id)}
                                    disabled={disabled}
                                    variant={variant as any}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-8 w-full flex justify-center">
                        <Button
                            text="Siguiente"
                            onClick={handleNext}
                            colorClass={(!selectedId || disabled) ? "bg-gray-400 text-white w-56 py-3 rounded-full hover:bg-gray-500 transition text-lg font-semibold mb-6" : "bg-[#172FA6] text-white w-56 py-3 rounded-full hover:bg-[#142a82] transition text-lg font-semibold cursor-pointer mb-6"}
                            disabled={!selectedId || disabled}
                        />
                    </div>
                </LayeredCard>
            </div>
        </Background>
    );
}
