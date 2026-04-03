import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
    // Configurações base do Next.js (acessibilidade, imagens, performance, etc.)
    ...nextVitals,
    ...nextTs,

    // Regras extras para TS/TSX
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { project: true },
        },
        rules: {
            // Organiza imports automaticamente ao salvar
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            // Boas práticas de TS sem ser excessivo
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        },
    },

    // Regras para JS puro (arquivos de config, scripts)
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },

    // Ignorar pastas geradas — DEVE ser o padrão do Next
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

    // SEMPRE por último: desativa regras que conflitam com Prettier
    prettierConfig,
])

export default eslintConfig
