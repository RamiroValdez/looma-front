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
            // 🔧 Hooks fuera de componentes → desactivado
            'react-hooks/rules-of-hooks': 'off',

            // ⚠️ Dependencias de useEffect → advertencia
            'react-hooks/exhaustive-deps': 'warn',

            // 🔧 Uso de "any" → desactivado
            '@typescript-eslint/no-explicit-any': 'off',

            // ⚠️ Variables declaradas pero no usadas → advertencia
            '@typescript-eslint/no-unused-vars': ['warn'],
        },
    },
]);


