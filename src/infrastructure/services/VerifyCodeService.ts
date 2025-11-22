export const verifyCode = async (email: string, code: string) => {
  const response = await fetch(
    import.meta.env.VITE_API_BASE_URL + "/auth/register/verify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }
  );
  if (!response.ok) {
    throw new Error("Código incorrecto o expirado.");
  }
  return response.json();
};