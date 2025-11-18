import { useState } from "react";
import { useRegister as registerUser } from "../../infrastructure/services/AuthService";
import { notifySuccess, notifyError } from "../../infrastructure/services/ToastProviderService";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = { name: "", surname: "", username: "", email: "", password: "", confirmPassword: "" };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }
    if (!formData.surname.trim()) {
      newErrors.surname = "El apellido es obligatorio";
      valid = false;
    }
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
      valid = false;
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "El email no es válido";
      valid = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    const response = await registerUser({
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    });

      if (response.status === 202) {
        notifySuccess("¡Revisa tu correo para el código de verificación!");
        navigate("/verify-code", { state: { email: formData.email } });
      } else {
        notifyError("Error al registrarse. Verifica los datos.");
      }
    } catch (error: any) {

      let msg = error.message || "Error al registrarse";
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
      if (msg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: "El correo ya está registrado" }));
      } else if (msg.toLowerCase().includes("username")) {
        setErrors((prev) => ({ ...prev, username: "El usuario ya existe" }));
      } else {
        notifyError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, handleChange, handleSubmit };
};
