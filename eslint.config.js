import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
    {
        ignores: [
            '**/*.*',

            '!shared/src/**/*.*',

            '!play/src/**/*.*',

            '!watch/src/**/*.*',

            '!preview/src/**/*.*',

            '!tutorial/src/**/*.*',
        ],
    },

    eslint.configs.recommended,

    ...tsEslint.configs.recommendedTypeChecked,
    ...tsEslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'no-restricted-properties': [
                'error',
                {
                    object: 'debug',
                    message: 'Debug calls should be removed from production.',
                },
            ],
        },
    },

    eslintConfigPrettier,
)
