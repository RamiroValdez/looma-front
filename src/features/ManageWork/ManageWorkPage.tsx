import React, { useState, useEffect } from 'react';
import type { WorkDTO } from '../../dto/WorkDTO';
import { WorkService } from '../../services/work.service';
import { ChapterItem } from '../../components/ChapterItem';
import Button from '../../components/Button';

interface ManageWorkPageProps {
  workId?: number;
}

export const ManageWorkPage: React.FC<ManageWorkPageProps> = ({ workId }) => {
  const [work, setWork] = useState<WorkDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultWorkId = 1; // por defecto que coincide con nuestro JSON
  const currentWorkId = workId || defaultWorkId;

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setLoading(true);
        const workData = await WorkService.getWorkById(currentWorkId);
        setWork(workData);
      } catch (err) {
        setError('Error loading work');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWork();
  }, [currentWorkId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando obra...</div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">{error || 'Work not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0EEF6' }}>
      {/* Main Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${work.bannerUrl})` }}
      >
        <div className="absolute inset-0 bg-opacity-40"></div>
        <div className="absolute top-4 right-4">
          <Button 
            text="Editar Banner"
            onClick={() => console.log('Editar Banner')}
            colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6]"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

          {/* Columna 1: Portada */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-300 lg:pr-6">
            <div className="sticky top-8">
              <div className="flex flex-col items-start">
                <img 
                  src={work.coverUrl} 
                  alt={work.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-md mb-3"
                />
                <Button 
                  text="Editar Portada"
                  onClick={() => console.log('Editar Portada')}
                  colorClass="bg-[#3C2A50] hover:bg-[#2A1C3A] focus:ring-[#3C2A50] text-sm mb-2 w-48"
                />
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, WEBP (máx. 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Columna 2-3: Información Principal y Contenido */}
          <div className="lg:col-span-6 lg:border-r lg:border-gray-300 lg:pr-6 lg:pl-6">
            {/* Información de la Obra */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black">
                <span className="font-bold">Nombre de la obra:</span> <span className="font-normal">{work.title}</span>
              </h1>
            </div>

            {/* Categorias */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg">Categorías:</span>
                <div className="flex flex-wrap gap-2">
                  {work.categories.map((category) => (
                    <span 
                      key={category.id}
                      className="px-3 py-1 bg-[#F0EEF6] text-[#172FA6] border border-[#172FA6] rounded-full text-sm"
                    >
                      {category.name}
                    </span>
                  ))}
                  <Button 
                    text="+"
                    onClick={() => console.log('Agregar categoría')}
                    colorClass="bg-[#F0EEF6] hover:bg-[#A0ADED] focus:ring-[#172FA6] !text-[#172FA6] hover:!text-white border border-[#172FA6] h-8 w-8 rounded-full flex items-center justify-center text-2xl p-0 leading-none font-light"
                  />
                </div>
              </div>
            </div>

            {/* Formato e Idioma Original */}
            <div className="mb-6">
              <div className="space-y-6 text-lg text-black">
                <div><span className="font-semibold">Formato:</span> <span className="font-normal">{work.format.name}</span></div>
                <div><span className="font-semibold">Idioma Original:</span> <span className="font-normal">{work.originalLanguage}</span></div>
              </div>
            </div>

            {/* Etiquetas */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg">Etiquetas:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#F0EEF6] text-[#5C17A6] border border-[#5C17A6] rounded-full text-sm">
                    aventura
                  </span>
                  <span className="px-3 py-1 bg-[#F0EEF6] text-[#5C17A6] border border-[#5C17A6] rounded-full text-sm">
                    distopía
                  </span>
                  <span className="px-3 py-1 bg-[#F0EEF6] text-[#5C17A6] border border-[#5C17A6] rounded-full text-sm">
                    supervivencia
                  </span>
                  <Button 
                    text="+"
                    onClick={() => console.log('Agregar etiqueta')}
                    colorClass="bg-[#F0EEF6] hover:bg-[#C9A4F2] focus:ring-[#5C17A6] !text-[#5C17A6] hover:!text-white border border-[#5C17A6] h-8 w-8 rounded-full flex items-center justify-center text-2xl p-0 leading-none font-light"
                  />
                  <button
                    onClick={() => console.log('Generar etiquetas automáticamente')}
                    className="bg-[#F0EEF6] hover:bg-[#C9A4F2] focus:ring-[#5C17A6] text-[#5C17A6] hover:text-white border border-[#5C17A6] h-8 w-8 rounded-full flex items-center justify-center text-sm p-0 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <span className="material-symbols-outlined text-xs">wand_stars</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Capítulos */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="text-white font-semibold text-lg px-6 py-4" style={{ backgroundColor: '#3C2A50' }}>
                  Capítulos
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {work.chapters.map((chapter) => (
                      <ChapterItem 
                        key={chapter.id}
                        chapter={chapter}
                      />
                    ))}
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button 
                      text="Agregar Capítulo"
                      onClick={() => console.log('Agregar Capítulo')}
                      colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Administración */}
          <div className="lg:col-span-2 lg:pl-4">
            <div className="sticky top-8">
              {/* Título */}
              <h2 className="text-3xl font-bold text-black mb-4 text-center">Administrar</h2>
              
              {/* Tarjeta de administración */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-base text-black">
                      <input type="checkbox" className="mr-2" />
                      <span>Permitir suscripción a obra</span>
                    </label>
                  </div>

                  <hr className="border-gray-300" />
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <label className="text-black font-medium text-base">Precio:</label>
                      <div className="flex items-center border rounded">
                        <span className="px-2 py-2 bg-gray-50 border-r text-base text-black">$</span>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          className="px-2 py-2 text-base text-black rounded-r focus:outline-none focus:ring-2 focus:ring-[#5C17A6] w-24"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-300" />
                  
                  <div className="space-y-2">
                    <div>
                      <label className="flex items-center text-base text-black">
                        <input type="radio" name="estado" className="mr-2" />
                        <span>Marcar como pausado</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center text-base text-black">
                        <input type="radio" name="estado" className="mr-2" />
                        <span>Marcar como finalizado</span>
                      </label>
                    </div>
                  </div>

                  <hr className="border-gray-300" />
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => console.log('Eliminar')}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200 flex-1"
                    >
                      Eliminar
                    </button>
                    <Button 
                      text="Guardar"
                      onClick={() => console.log('Guardar cambios')}
                      colorClass="bg-[#5C17A6] hover:bg-[#4A1285] focus:ring-[#5C17A6] flex-1 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkPage;