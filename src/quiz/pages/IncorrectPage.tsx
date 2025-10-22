import Background from '../components/Background';
import CharacterAvatar from '../components/CharacterAvatar';
import loomiImg from '../images/loomi_triste.png';
import { useLocation } from 'react-router-dom';
import AnswerOption from '../components/AnswerOption';
import type { QuestionDTO } from '../dto/QuestionDTO';

type NavState = {
  selectedId?: string;
  correctId?: string;
  question?: QuestionDTO;
  questionId?: number;
  questionText?: string;
  options?: { id: string; text: string }[];
  selectedOption?: { id: string; text: string };
  correctOption?: { id: string; text: string };
}

export default function IncorrectPage() {
    const { state } = useLocation();
    const nav = state as NavState | null;
  const selectedOption = nav?.selectedOption;
  const correctOption = nav?.correctOption;

    return (
        <Background>
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-[#CDBBE1] rounded-xl ">
                    <div className="flex flex-col items-center">
                        <div className="mt-6 text-center">
                            <h2 className="text-3xl font-bold text-[#5C17A6]">OOPS...</h2>
                            <h2 className="text-3xl font-bold text-[#5C17A6]">RESPUESTA INCORRECTA</h2>
                        </div>

                        <div className="mt-6 w-[80%]">
                          {selectedOption && (
                            <AnswerOption
                              asDiv
                              letter="D"
                              text={selectedOption.text}
                              className="border-4 border-red-500"
                            />
                          )}

                          {correctOption && (
                            <AnswerOption
                              asDiv
                              letter="C"
                              text={correctOption.text}
                              className="border-4 border-green-400"
                            />
                          )}
                        </div>

                        <div className="mt-6">
                            <CharacterAvatar src={loomiImg} size={220} />
                        </div>

                        <div className="-mx-6 bg-[#2b1a3a] rounded-b-md py-3 text-center block min-w-full">
                            <div className="text-white text-xl font-semibold">¡Muchas gracias por participar!</div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    );
}
