import { useState, useEffect } from 'react';
import type { UserPreferences, PreferenceCategoryInfo } from './types';

// Datos mockeados de preferencias del usuario
const mockUserPreferences: UserPreferences = {
  genres: [
    { id: '1', name: 'Fantasía', category: 'genres', icon: '🧙‍♂️' },
    { id: '2', name: 'Ciencia Ficción', category: 'genres', icon: '🚀' },
    { id: '3', name: 'Romance', category: 'genres', icon: '💕' },
    { id: '4', name: 'Misterio', category: 'genres', icon: '🔍' },
  ],
  formats: [
    { id: '5', name: 'Novela', category: 'formats', icon: '📚' },
    { id: '6', name: 'Cuento Corto', category: 'formats', icon: '📄' },
    { id: '7', name: 'Poesía', category: 'formats', icon: '✍️' },
  ],
  languages: [
    { id: '8', name: 'Español', category: 'languages', icon: '🇪🇸' },
    { id: '9', name: 'Inglés', category: 'languages', icon: '🇺🇸' },
    { id: '10', name: 'Francés', category: 'languages', icon: '🇫🇷' },
  ],
  themes: [
    { id: '11', name: 'Aventura', category: 'themes', icon: '⚔️' },
    { id: '12', name: 'Drama', category: 'themes', icon: '🎭' },
    { id: '13', name: 'Comedia', category: 'themes', icon: '😄' },
    { id: '14', name: 'Thriller', category: 'themes', icon: '😱' },
  ],
  tags: [
    { id: '15', name: 'Realismo Mágico', category: 'tags', icon: '✨' },
    { id: '16', name: 'Distopía', category: 'tags', icon: '🏙️' },
    { id: '17', name: 'Coming of Age', category: 'tags', icon: '🌱' },
    { id: '18', name: 'Feminismo', category: 'tags', icon: '♀️' },
  ],
};

export const categoriesInfo: PreferenceCategoryInfo[] = [
  {
    key: 'genres',
    title: 'Géneros Favoritos',
    description: 'Los géneros literarios que más disfrutas',
    icon: '📖'
  },
  {
    key: 'formats',
    title: 'Formatos Preferidos',
    description: 'Los tipos de contenido que prefieres leer',
    icon: '📝'
  },
  {
    key: 'languages',
    title: 'Idiomas',
    description: 'Los idiomas en los que te gusta leer',
    icon: '🌍'
  },
  {
    key: 'themes',
    title: 'Temas de Interés',
    description: 'Los temas y estilos que más te atraen',
    icon: '🎨'
  },
  {
    key: 'tags',
    title: 'Etiquetas Especiales',
    description: 'Etiquetas específicas que sigues',
    icon: '🏷️'
  }
];

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular una llamada a la API
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular posible error (5% de probabilidad)
        if (Math.random() < 0.05) {
          throw new Error('Error al cargar las preferencias del usuario');
        }
        
        setPreferences(mockUserPreferences);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setPreferences(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const refetch = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setPreferences(mockUserPreferences);
    setError(null);
  };

  return {
    preferences,
    loading,
    error,
    refetch,
    categoriesInfo
  };
};