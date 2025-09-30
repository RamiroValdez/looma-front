import Button from "../../components/Button";
import { useNavigate } from 'react-router-dom'; 

    const PURPLE_BG_CLASS = "bg-[#5C17A6]";
    const CREATE_PATH = '/Create';     
    const INSTRUCTIONS_PATH = '/Terms';

export default function CreatePiece() {
 
    const navigate = useNavigate(); /*Hook navigate*/

    return (

        <div className="min-h-screen bg-#F0EEF6-900 text-gray-100 p-8">
            <header className="flex justify-between items-start mb-10">
                
                {/* Titles */}
                <div>
                    <h1 className="text-black text-3xl font-bold">Mis Obras</h1>
                    <p className="text-gray-400">Organiza y gestiona tu contenido literario.</p>
                </div>
                
                {/* Instruction button */}
                <Button 
                    text="Instrucciones" 
                    onClick={() => navigate(INSTRUCTIONS_PATH)} 
                    colorClass={`${PURPLE_BG_CLASS} cursor-pointer hover:scale-105`} 
                />
            </header>


            {/*Main*/}
            <main className="flex flex-col items-center justify-center min-h-[70vh]">

                <img src="/img/Carita.png" alt="no works" className="w-40 h-40 mb-8" ></img>
                <p className="text-gray-400 mb-8 w-full text-xl text-center">Aún no tienes ninguna obra publicada</p>
                
                {/* Create button */}
                <Button 
                    text ="Crear +" 
                    onClick={() => navigate(CREATE_PATH)} 
                    colorClass={`${PURPLE_BG_CLASS} font-bold px-35 cursor-pointer hover:scale-105`} 
                />
            </main>
        </div>
    );
}