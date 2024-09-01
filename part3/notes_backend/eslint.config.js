// // this mod provides predifined config
// import js from '@eslint/js';
// import stylisticJs from '@stylistic/eslint-plugin-js';
// import globals from 'globals';

// export default [
//     js.configs.recommended,
//     {
//         ignores: ['dist/**'],
//     },
//     {
//         files: ['**/*.js'],
//         languageOptions: {
//             sourceType: 'module',
//             // ESLINT includes all global variables in node eg. process
//             globals: {
//                 ...globals.node,
//             },
//             ecmaVersion: 'latest',
//         },

//         // plugin & rules defines the code styles we shd use
//         plugins: {
//             '@stylistic/js': stylisticJs,
//         },
//         rules: {
//             '@stylistic/js/indent': ['error', 4],
//             '@stylistic/js/linebreak-style': ['error', 'unix'],
//             '@stylistic/js/quotes': ['error', 'single'],
//             'eqeqeq': 'error',
//             'no-trailing-spaces': 'error',
//             'object-curly-spacing': [
//                 'error', 'always'
//             ],
//             'arrow-spacing': [
//                 'error', { 'before': true, 'after': true },
//             ],
//         },
//     },
// ];
