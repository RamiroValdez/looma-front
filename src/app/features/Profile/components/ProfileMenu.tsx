import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../domain/store/AuthStore';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return (
    <div className="profile-menu w-64 h-screen bg-gray-100 p-4">
      <ul className="space-y-2">
        <li className="hover:bg-gray-200 hover:shadow-md cursor-pointer p-4 rounded text-lg border-b border-gray-300">Mi Perfil</li>
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
            navigate('/login');
          }}
        >
          Cerrar Sesión
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu;