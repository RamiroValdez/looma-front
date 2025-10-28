import Background from '../components/Background';
import LayeredCard from '../components/LayeredCard';
import CharacterAvatar from '../components/CharacterAvatar';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import loomiImg from '../images/loomi-feliz.png';

export default function StartPage() {
    const navigate = useNavigate();

    return (
        <Background>
            <div className="max-w-md mx-auto mt-8">
                <LayeredCard
                    topContent={
                        <div className="bg-white rounded-md px-6 py-3 shadow-md text-center">
                            <h1 className="text-xl font-bold text-[#5C17A6]">
                                Cuestionario de 5 preguntas para evaluar tu conocimiento en obras literarias
                            </h1>
                        </div>
                    }
                >
                    <div className="flex flex-col items-center">
                        <div className="mt-8">
                            <CharacterAvatar src={loomiImg} size={220} />
                        </div>

                        <div className="mt-12 w-full flex justify-center">
                            <Button
                                text="Comenzar"
                                onClick={() => navigate('/quiz/questions')}
                                colorClass="bg-[#172FA6] text-white w-56 py-3 rounded-full hover:bg-[#142a82] transition text-lg font-semibold cursor-pointer mb-6"
                            />
                        </div>
                    </div>
                </LayeredCard>
            </div>
        </Background>
    );
}
