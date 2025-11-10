import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../../domain/store/AuthStore';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../../../infrastructure/services/DataUserService';
import { type UserDTO } from '../../../../domain/dto/UserDTO';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDTO | null>(null);

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

  return (
    <div className="profile-menu w-64 h-screen bg-gray-100 p-4">
      <ul className="space-y-2">
        <li 
          className={`cursor-pointer p-4 rounded text-lg border-b border-gray-300 ${
            user && id === user.id.toString() 
              ? 'bg-gray-300 text-black' 
              : 'hover:bg-gray-200 hover:shadow-md'
          }`}
          onClick={() => user && navigate(`/profile/${user.id}`)}
        >
          Mi Perfil
        </li>

        <li className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300">Suscripciones</li>
        <li className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300">Guardados</li>
        
        <li
          className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300"
          onClick={() => navigate('/my-works')}
        >
          Mis Obras
        </li>
        
        <li className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300">Preferencias</li>
        <li className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300">Estadísticas</li>
        <li className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300">Términos y condiciones</li>
        
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
  );
};

export default ProfileMenu;