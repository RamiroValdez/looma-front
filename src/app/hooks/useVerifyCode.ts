import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../domain/store/AuthStore"
import { verifyCode } from "../../infrastructure/services/VerifyCodeService"; 

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
      useAuthStore.getState().setToken(data.token);
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