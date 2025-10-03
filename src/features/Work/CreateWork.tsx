import Button from "../../components/Button";
import { useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { WorkItem } from '../../components/WorkItem'; 
import type { Work } from '../../types.ts/MyWorks.types'; // DTO
import { fetchMyWorks } from '../../services/MyWorks.service'; // SERVICE

const PURPLE_BG_CLASS = "bg-[#5C17A6]"; 
const CREATE_PATH = '/Create'; // ruta boton crear+ 
const INSTRUCTIONS_PATH = '/Terms'; // ruta boton instrucciones
const CURRENT_USER_ID = 101; 


export default function CreateWork() {
    
    // 1. HOOKS
    const navigate = useNavigate(); 
    const [myWorks, setMyWorks] = useState<Work[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. EFECTO PARA CARGAR DATOS (Ahora llama al servicio)
    useEffect(() => {
        setLoading(true);
        setError(null); 
        
        fetchMyWorks(CURRENT_USER_ID)
            .then((data: Work[]) => {
                setMyWorks(data); 
            })
            .catch(error => {
                console.error("Error al cargar las obras:", error);
                setError("Hubo un error al obtener tus obras.");
            })
            .finally(() => {
                setLoading(false); 
            });
    }, []); 

    const hasWorks = myWorks.length > 0;
    
    return (
        <div className="min-h-screen bg-#F0EEF6-900 text-gray-100 p-8">
            <header className="flex justify-between items-start mb-10">
                
                {/* Titles */}
                <div>
                    <h1 className="text-black text-3xl font-bold">
                        {loading ? 'Cargando...' : 'Mis Obras'}
                    </h1>
                    <p className="text-gray-400">Organiza y gestiona tu contenido literario.</p>
                </div>
                
                <Button 
                    text="Instrucciones" 
                    onClick={() => navigate(INSTRUCTIONS_PATH)} 
                    colorClass={`${PURPLE_BG_CLASS} cursor-pointer hover:scale-105`} 
                />
            </header>


            {/*Main*/}
            <main className="flex flex-col items-center min-h-[70vh] p-4">

                {loading ? (
                    <div className="text-black text-center mt-20">Cargando obras...</div>
                ) : error ? ( // 🎯 Manejo del error de red
                    <div className="text-red-600 text-center mt-20">{error}</div>
                ) : hasWorks ? (
                    // MOSTRAR LISTA DE OBRAS
                    <div className="w-full flex flex-col items-center">
                        {myWorks.map(work => (
                            <WorkItem key={work.id} work={work} />
                        ))}
                    </div>
                ) : (
                    // MOSTRAR MENSAJE DE NO OBRAS
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <img src="/img/Carita.png" alt="no works" className="w-40 h-40 mb-8" />
                        <p className="text-gray-400 mb-8 w-full text-xl text-center">Aún no tienes ninguna obra publicada</p>
                    </div>
                )}
                
                {/* Create button */}
                <div className="mt-8">
                    <Button 
                        text ="Crear +" 
                        onClick={() => navigate(CREATE_PATH)} 
                        colorClass={`${PURPLE_BG_CLASS} font-bold px-35 cursor-pointer hover:scale-105`} 
                    />
                </div>
            </main>
        </div>
    );
}