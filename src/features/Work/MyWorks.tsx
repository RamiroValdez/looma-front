import Button from "../../components/Button";
import { useNavigate } from 'react-router-dom';
import { WorkItem } from '../../components/WorkItem';
import type { WorkDTO } from '../../dto/WorkDTO';
import { useMyWorks } from '../../services/MyWorks.service';
import { useUserStore } from "../../store/UserStorage.ts";

const PURPLE_BG_CLASS = "bg-[#5C17A6]";
const CREATE_PATH = '/Create';
const INSTRUCTIONS_PATH = '/Terms';


export default function CreateWork() {
    const navigate = useNavigate();
    const USER_ID = useUserStore().user?.userId;

    const { data: myWorks = [], isLoading, error } = useMyWorks(USER_ID || 0);

    const hasWorks = myWorks.length > 0;

    return (
        <div className="min-h-screen bg-#F0EEF6-900 text-gray-100 p-8">
            <header className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-black text-3xl font-bold">
                        {isLoading ? 'Cargando...' : 'Mis Obras'}
                    </h1>
                    <p className="text-gray-400">Gestiona y organiza tu contenido literario.</p>
                </div>

                <Button
                    text="Instrucciones"
                    onClick={() => navigate(INSTRUCTIONS_PATH)}
                    colorClass={`${PURPLE_BG_CLASS} font-semibold mr-4 cursor-pointer hover:scale-105`}
                />
            </header>

            <main className="flex flex-col items-center min-h-[70vh] p-4">

                {isLoading ? (
                    <div className="text-black text-center mt-20">Cargando obras...</div>
                ) : error ? (
                    <div className="text-red-600 text-center mt-20">
                        Error al cargar las obras: {(error as Error).message || 'Error desconocido'}</div>
                ) : hasWorks ? (
                    /* SI TIENE OBRAS: */
                    <> 
                        <div className="w-full flex justify-end mb-4">
                            <Button
                                text="Crear +"
                                onClick={() => navigate(CREATE_PATH)}
                                colorClass={`${PURPLE_BG_CLASS} font-semibold px-8 cursor-pointer hover:scale-105`}
                            />
                        </div>
                        <div className="w-full flex flex-col items-center">
                            {/* Aquí puedes agrupar por tipo (Comics, Novelas) como en tu imagen */}
                            {myWorks.map(work => (
                                <WorkItem key={work.id} work={work} />
                            ))}
                        </div>
                    </>
                ) : (
                    /* CASO SIN OBRAS:*/
                    <>
                        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                            <img src="/img/Carita.png" alt="no works" className="w-40 h-40 mb-8" />
                            <p className="text-gray-400 mb-8 w-full text-xl text-center">
                                Aún no tienes ninguna obra publicada.
                            </p>
                        </div>
                        <div className="mt-8">
                            <Button
                                text="Crear +"
                                onClick={() => navigate(CREATE_PATH)}
                                colorClass={`${PURPLE_BG_CLASS} font-semibold px-35 cursor-pointer hover:scale-105`}
                            />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}