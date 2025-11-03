import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    // Ignorás la carpeta de build
    globalIgnores(['dist']),

    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            // 🔧 Desactivamos la regla que prohíbe hooks fuera de componentes
            'react-hooks/rules-of-hooks': 'off',

            // (Opcional) mantené la de dependencias como advertencia
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
]);
