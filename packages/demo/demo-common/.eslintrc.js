"use strict";

module.exports = {
    root: true,
    env: {
        browser: true,
        worker: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    plugins: ['vue'],
    extends: [
        '@lljj/eslint-config',
        '@lljj/eslint-config/vue'
    ],
    rules: {
        // 递归组件导致了循环依赖
        'import/no-cycle': 'off',
        'max-line-length': 'off',
        "no-restricted-globals": 'off',
        "semi": 'off',
        'indent': "off",
        "max-len": 'off',
        'vue/script-indent': 'off',
        'space-before-function-paren': 0,
        'prefer-const': 'off',
        // 临时去掉vue相关规则
        'import/no-webpack-loader-syntax': 'off',
        'vue/no-use-v-if-with-v-for': 'off',
        'vue/no-unused-components': 'off',
        'vue/valid-v-for': 'off',
        'vue/require-v-for-key': 'off',
        'vue/return-in-computed-property': 'off',
        'vue/require-valid-default-prop': 'off',
        'vue/no-unused-vars': 'off',
        'no-mixed-operators': 'off',
        'no-case-declarations': 'off',
        'vue/no-side-effects-in-computed-properties': 'off',
        'prefer-promise-reject-errors': 'off',
        'vue/no-parsing-error': 'off', // 可以直接去除
        'no-unused-expressions': 'off',
        'vue/valid-v-model': 'off',
        'no-irregular-whitespace': 'off', // 可以直接去除
        'no-control-regex': 'off',
        'no-else-return': 'off',
        'vue/max-attributes-per-line': 'off',
        'import/newline-after-import': 'off',
        'vue/html-closing-bracket-newline': 'off'
    },
    globals: {
        'self': true
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                "indent": "off",
                'max-line-length': 'off',
                "no-restricted-globals": 'off',
                "max-len": 'off',
                "semi": 'off'
            }
        }
    ]
};
