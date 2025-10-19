import Background from '../components/Background';
import CharacterAvatar from '../components/CharacterAvatar';
import loomiImg from '../images/loomi_festejo.png';

export default function CorrectPage() {
    return (
        <Background>
            <div className="max-w-md mx-auto mt-8">
                <div className="bg-[#CDBBE1] rounded-xl ">
                    <div className="flex flex-col items-center">
                        <div className="mt-6 text-center">
                            <h2 className="text-3xl font-bold text-[#5C17A6]">¡FELICITACIONES!</h2>
                        </div>

                        <div className="mt-6">
                            <CharacterAvatar src={loomiImg} size={320} />
                        </div>

                        <div className="-mx-6 mt-6 bg-white py-3 text-center rounded-t-md block min-w-full">
                            <div className="text-[#172FA6] text-xl font-semibold">¡Ganaste un separador!</div>
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
