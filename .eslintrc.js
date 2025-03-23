module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        'shared-node-browser': true,
        es2024: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
        },
    },
    plugins: ['prettier', '@typescript-eslint'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true }],
        indent: ['error', 4, { SwitchCase: 1 }],
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
