import Button from "../../components/Button";
import { useNavigate } from 'react-router-dom';
import { WorkItem } from '../../components/WorkItem';
import { useMyWorks } from '../../services/MyWorks.service';
import { useUserStore } from "../../store/UserStorage.ts";

const PURPLE_BG_CLASS = "bg-[#5C17A6]";
const CREATE_PATH = '/Create';
const INSTRUCTIONS_PATH = '/Terms';
const MAX_WIDTH_CLASS = "max-w-6xl";

export default function CreateWork() {
    const navigate = useNavigate();
    const USER_ID = useUserStore().user?.userId;

    const { data: myWorks = [], isLoading, error } = useMyWorks(USER_ID || 0);

    const hasWorks = myWorks.length > 0;

    const novelas = myWorks.filter(work => work.format?.name === 'Novela');
    const comics = myWorks.filter(work => work.format?.name === 'Cómic');
    const cuentos = myWorks.filter(work => work.format?.name === 'Cuento');
    
    const allGroups = [
        { name: 'Novelas', works: novelas },
        { name: 'Cómics', works: comics },
        { name: 'Cuentos', works: cuentos },
    ];
    
    const firstGroup = allGroups.find(group => group.works.length > 0);


    return (
        // Contenedor principal con fondo (ocupa 100% del ancho)
        <div className="min-h-screen bg-[#F0EEF6] p-4 sm:p-8">
            
            {/* HEADER */}
            <header className={`mx-auto ${MAX_WIDTH_CLASS} flex justify-between items-start mb-10`}>
                <div>
                    <h1 className="text-[#2B2B2B] text-3xl font-bold">
                        {isLoading ? 'Cargando...' : 'Mis Obras'}
                    </h1>
                    <p className="text-[#474747]">Gestiona y organiza tu contenido literario.</p>
                </div>

                <Button
                    text="Instrucciones"
                    onClick={() => navigate(INSTRUCTIONS_PATH)}
                    colorClass={`${PURPLE_BG_CLASS} text-white font-medium cursor-pointer hover:scale-105`}
                />
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className={`mx-auto ${MAX_WIDTH_CLASS} flex flex-col items-center min-h-[70vh]`}>

                {isLoading ? (
                    <div className="text-black text-center mt-20">Cargando obras...</div>
                ) : error ? (
                    <div className="text-red-600 text-center mt-20">
                        Error al cargar las obras: {(error as Error).message || 'Error desconocido'}</div>
                ) : hasWorks ? (
                    /* SI TIENE OBRAS: */
                    <div className="w-full flex flex-col items-center">
                        {/* Renderizado de grupos */}
                        {allGroups.map(group => (
                            group.works.length > 0 && (
                                <section 
                                    key={group.name} 
                                    className="mb-8 w-full"
                                >
                                    {/*Título y Botón CREAR + */}
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-[#2B2B2B] text-2xl font-bold">
                                            {group.name} ({group.works.length})
                                        </h2>
                                        
                                        {/* Botón CREAR + solo en la misma línea que el primer grupo */}
                                        {group === firstGroup && (
                                            <Button
                                                text="Crear +"
                                                onClick={() => navigate(CREATE_PATH)}
                                                colorClass={`${PURPLE_BG_CLASS} text-white font-semibold cursor-pointer hover:scale-105`}
                                            />
                                        )}
                                    </div>

                                    {/* Contenedor WorkItem */}
                                    <div className="flex flex-col items-center">
                                        {group.works.map(work => (
                                            <WorkItem key={work.id} work={work} />
                                        ))}
                                    </div>
                                </section>
                            )
                        ))}
                    </div>
                ) : (
                    /* CASO SIN OBRAS: */
                    <div className="w-full flex flex-col items-center">
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                            <img src="/img/Carita.png" alt="no works" className="w-40 h-40 mb-8" />
                            <p className="text-gray-500 mb-8 w-full text-xl text-center">
                                Aún no tienes ninguna obra publicada.
                            </p>
                        </div>
                        <div className="mt-8">
                            <Button
                                text="Crear +"
                                onClick={() => navigate(CREATE_PATH)}
                                colorClass={`${PURPLE_BG_CLASS} font-semibold px-8 cursor-pointer hover:scale-105`}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}