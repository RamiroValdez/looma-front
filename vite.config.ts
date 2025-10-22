/// <reference types="vitest" /> 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  test: {
    // Usamos jsdom porque lo instalamos y lo necesitamos para React
    environment: 'jsdom', 
    
    // Le decimos a Vitest que ejecute este archivo antes de todos los tests
    setupFiles: './setupTests.ts', 
    
    // Hacemos que las funciones de test sean globales
    globals: true, 
    
    // Definimos qué archivos buscar
    include: ['**/*.{test,spec}.{ts,tsx}'],
  },
});