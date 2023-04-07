module.exports = {
	root: true,
	globals: {
		__DEV__: true,
		process: true,
		window: true,
		document: true
	},
	env: {
		node: true
	},
	extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier'],
	parser: '@babel/eslint-parser',
	parserOptions: {
		sourceType: 'module',
		requireConfigFile: false,
		babelOptions: {
			presets: [require.resolve('./index.js')]
		}
	},
	plugins: ['@babel', 'import'],
	rules: {
		'block-scoped-var': 'warn',
		curly: ['warn', 'multi-line'],
		eqeqeq: ['warn', 'smart'],
		'new-parens': 'warn',
		'no-alert': 'warn',
		'no-array-constructor': 'warn',
		'no-caller': 'error',
		'no-catch-shadow': 'error',
		'no-cond-assign': ['warn', 'except-parens'],
		'no-constant-condition': 'warn',
		'no-control-regex': 'off',
		'no-debugger': 'off',
		'no-div-regex': 'warn',
		'no-empty': 'warn',
		'no-eval': 'warn',
		'no-extend-native': 'warn',
		'no-extra-bind': 'warn',
		'no-extra-boolean-cast': 'warn',
		'no-extra-semi': 'off',
		'no-fallthrough': 'warn',
		'no-floating-decimal': 'warn',
		'no-func-assign': 'warn',
		'no-implied-eval': 'warn',
		'no-inner-declarations': 'off',
		'no-irregular-whitespace': 'warn',
		'no-iterator': 'error',
		'no-label-var': 'error',
		'no-labels': 'error',
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'no-global-assign': 'error',
		'no-unsafe-negation': 'error',
		'no-new-func': 'error',
		'no-new-object': 'warn',
		'no-new-wrappers': 'warn',
		'no-octal-escape': 'warn',
		'no-proto': 'error',
		'no-redeclare': [
			'error',
			{
				builtinGlobals: true
			}
		],
		'no-regex-spaces': 'warn',
		'no-return-assign': ['warn', 'except-parens'],
		'no-script-url': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'warn',
		'no-shadow': [
			'warn',
			{
				builtinGlobals: true,
				hoist: 'all',
				allow: ['context']
			}
		],
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'warn',
		'no-unexpected-multiline': 'warn',
		'no-unneeded-ternary': 'warn',
		'no-unreachable': 'warn',
		'no-unused-vars': 'warn',
		'no-use-before-define': [
			'warn',
			{
				functions: false
			}
		],
		'no-useless-call': 'warn',
		'no-useless-escape': 'off',
		'no-var': 'warn',
		'require-yield': 'off',
		'use-isnan': 'warn',
		'wrap-iife': ['error', 'inside'],

		// babel plugin https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin
		'@babel/new-cap': [
			'error',
			{
				newIsCap: true,
				capIsNew: false
			}
		],
		'@babel/no-unused-expressions': 'warn',

		'import/no-unresolved': ['error', {commonjs: true, caseSensitive: true}],
		'import/named': 'error',
		'import/first': 'warn',
		'import/no-duplicates': 'error',
		'import/extensions': ['warn', 'always', {js: 'never', json: 'always'}],
		'import/newline-after-import': 'warn',
		'import/order': [
			'warn',
			{
				'newlines-between': 'never',
				groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index']
			}
		]
	}
};
