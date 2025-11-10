// Importamos la librería que extiende 'expect' de Vitest con los 'matchers'
  // de DOM, permitiendo usar funcion como .toBeInTheDocument(), .toHaveTextContent(), etc.
  import '@testing-library/jest-dom/vitest';
  
  // Opcional: Si necesitas simular el tiempo, puedes añadir esto (útil para efectos asíncronos)
  // import { vi } from 'vitest';
  // vi.useFakeTimers();