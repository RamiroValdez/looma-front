import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../infrastructure/store/AuthStore';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../../infrastructure/services/DataUserService';
import { type UserDTO } from '../../../../domain/dto/UserDTO';

interface Props {
    onBlockSelected?: (block: string) => void;
    selectedBlock?: string; // nuevo prop para sincronizar desde el padre
}

const ProfileMenu = ({ onBlockSelected, selectedBlock }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [ blockSelected,  setBlockSelected] = useState<string>('profile');
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedBlock && selectedBlock !== blockSelected) {
      setBlockSelected(selectedBlock);
    }
  }, [selectedBlock]);

  const handleBlockClick = (block: string) => {
      if (onBlockSelected) {
          setBlockSelected(block);
          onBlockSelected(block);
      }
  };

  return user ? (
    <div className="profile-menu w-64 h-screen bg-gray-100 p-4 sticky top-0">
      <ul className="space-y-2">
        <li 
          className={`cursor-pointer p-4 rounded text-lg border-b border-gray-300 ${
              blockSelected == 'profile' 
              ? 'bg-gray-300 text-black' 
              : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          onClick={() => handleBlockClick('profile')}>Mi Perfil</li>

        <li 
          className={`cursor-pointer p-4 rounded text-lg border-b border-gray-300 ${
              blockSelected == 'subscriptions'
              ? 'bg-gray-300 text-black' 
              : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          onClick={() => handleBlockClick('subscriptions')}
        >
          Suscripciones
        </li>

        <li
          className={`cursor-pointer p-4 rounded text-lg border-b border-gray-300 ${
              blockSelected == 'mySaves'
                  ? 'bg-gray-300 text-black'
                  : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          onClick={() => handleBlockClick('mySaves')}
        >
          Guardados
        </li>
        
        <li
          className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300"
          onClick={() => navigate('/my-works')}
        >
          Mis Obras
        </li>

        <li
          className={`cursor-pointer p-4 rounded text-lg border-b border-gray-300 ${
              blockSelected == 'terms'
              ? 'bg-gray-300 text-black' 
              : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          onClick={() => handleBlockClick('terms')}
        >
          Términos y condiciones
        </li>

        <li className={`cursor-pointer p-4 rounded text-lg border-b border-gray-300 ${
            blockSelected == 'Analytics'
                ? 'bg-gray-300 text-black'
                : 'hover:bg-gray-200 hover:shadow-md'
        }`} onClick={() => handleBlockClick('Analytics')}>Estadísticas</li>

        <li
          className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg"
          onClick={() => {
            logout();
          }}
        >
          Cerrar Sesión
        </li>
      </ul>
    </div>
  ) : null;
};

export default ProfileMenu;