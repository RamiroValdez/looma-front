import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../domain/store/AuthStore"
import { verifyCode } from "../../infrastructure/services/VerifyCodeService"; 
import { useUserStore } from "../../domain/store/UserStorage";
import { getCurrentUser } from "../../infrastructure/services/DataUserService";

export const useVerifyCode = (email: string) => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyCode(email, code); 
      // Setear token en el store de auth
      useAuthStore.getState().setToken(data.token);

      // Sincronizar el usuario en el store de usuario con el token recién recibido
      try {
        const usr = await getCurrentUser(data.token);
        if (usr) {
          useUserStore.getState().setUser({
            userId: Number(usr.id),
            email: String(usr.email),
            name: String(usr.name),
            surname: String(usr.surname),
            username: String(usr.username),
          });
        } else {
          // Si por algún motivo no retorna usuario, limpiar store de usuario para evitar inconsistencias
          useUserStore.getState().clearUser();
        }
      } catch (e) {
        // En caso de error obteniendo el usuario, limpiar para no quedar con el anterior
        useUserStore.getState().clearUser();
      }

      navigate("/preferences");
    } catch (err: any) {
      setError(err.message || "Error al verificar el código.");
    } finally {
      setLoading(false);
    }
  };

  return {
    code,
    setCode,
    error,
    loading,
    handleSubmit,
  };
};