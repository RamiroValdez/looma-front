import { useState } from "react";
import { sendPreferences } from "../../infrastructure/services/PreferencesService";
import { useNavigate } from "react-router-dom";

export function usePreferences() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSelection = (value: string) => {
    setSelectedGenres((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setSending(true);
    setError(null);
    try {
      await sendPreferences(selectedGenres);
      navigate("/welcome");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setSending(false);
    }
  };

  return {
    selectedGenres,
    sending,
    error,
    toggleSelection,
    handleSubmit,
    setSelectedGenres,
  };
}