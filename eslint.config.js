import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
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
            // 🔧 Desactivar la restricción de hooks fuera de componentes
            'react-hooks/rules-of-hooks': 'off',

            // ⚠️ Mantener advertencia de dependencias de useEffect
            'react-hooks/exhaustive-deps': 'warn',

            // 🔧 Desactivar uso explícito de "any"
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
]);

