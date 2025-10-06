export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  // Manejo de errores desconocidos
  return "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.";
}