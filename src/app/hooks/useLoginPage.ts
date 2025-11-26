import { useEffect, useState } from "react";
import { useAuthStore } from "../../infrastructure/store/AuthStore.ts";
import { useUserStore } from "../../infrastructure/store/UserStorage.ts";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../infrastructure/services/AuthService";
import { getCurrentUser } from "../../infrastructure/services/DataUserService.ts";
import { notifyError, notifySuccess } from "../../infrastructure/services/ToastProviderService.ts";

export const useLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setToken, isAuthenticated } = useAuthStore();
    const { setUser } = useUserStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await useLogin(email, password);
            const user = await getCurrentUser(response.token);
            setToken(response.token);
            setUser({
                userId: Number(user?.id),
                email: String(user?.email),
                name: String(user?.name),
                surname: String(user?.surname),
                username: String(user?.username)
            });
            navigate('/home');
            notifySuccess("¡Inicio de sesión exitoso!");
        } catch (err) {
            console.error(err);
            notifyError("¡Inicio de sesión fallido! Por favor verifica tus datos.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin();
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        handleSubmit,
    };
};