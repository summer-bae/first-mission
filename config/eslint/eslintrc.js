const path = require('path');

const customPlugins = ['import'];

const customSettings = {
	'import/extensions': ['.js', '.ts'],
	'import/external-module-folders': ['.yarn'],
	'import/internal-regex':
		'^@(configs|constants|controllers|listeners|middlewares|models|modules|routes|utils|validations|type)',
};

const customRules = {
	'import/extensions': [
		'error',
		'ignorePackages',
		{
			js: 'never',
			ts: 'never',
		},
	],
	'import/no-unresolved': ['error', { caseSensitive: false }],
	'import/order': [
		'warn',
		{
			pathGroups: [
				{
					pattern: '@config/**',
					group: 'builtin',
					position: 'before',
				},
			],
			pathGroupsExcludedImportTypes: ['builtin'],
			groups: [
				'builtin',
				'external',
				'internal',
				'parent',
				'sibling',
				'index',
				'object',
				'type',
			],
		},
	],
	'no-tabs': 0,
	'no-underscore-dangle': 0,
	'consistent-return': 0,
	'no-empty': ['error', { allowEmptyCatch: true }],
	'no-await-in-loop': 0,
	'no-restricted-syntax': [
		'error',
		{
			selector: 'ForInStatement',
			message:
				'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
		},
		{
			selector: 'LabeledStatement',
			message:
				'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
		},
		{
			selector: 'WithStatement',
			message:
				'`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
		},
	],
	'import/prefer-default-export': 'off',
};

module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 13,
	},
	env: {
		node: true,
	},
	plugins: [...customPlugins],
	extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
	settings: {
		...customSettings,
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts'],
			},
		},
	},
	rules: {
		...customRules,
	},
	overrides: [
		{
			files: ['**/*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 13,
				tsconfigRootDir: path.resolve(__dirname, '../', '../'),
				project: ['tsconfig.json'],
			},
			plugins: [...customPlugins, '@typescript-eslint'],
			extends: [
				'eslint:recommended',
				'airbnb-base',
				'airbnb-typescript/base',
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'prettier',
			],
			env: {
				node: true,
			},
			settings: {
				...customSettings,
				'import/resolver': {
					node: {
						extensions: ['.js', '.ts'],
					},
					typescript: {},
				},
				'import/parsers': {
					'@typescript-eslint/parser': ['.ts'],
				},
			},
			rules: {
				...customRules,
			},
		},
	],
};
