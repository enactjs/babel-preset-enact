/*
 *  babel.config.js
 *
 *  A Babel javascript configuration dynamically setup for Enact
 *  development environment on target platforms.
 */
const path = require('path');

module.exports = function (api) {
	const env = process.env.BABEL_ENV || process.env.NODE_ENV;
	const es5Standalone = process.env.ES5 && process.env.ES5 !== 'false';

	if (api && api.cache) api.cache(() => env + es5Standalone);

	return {
		presets: [
			[
				require('@babel/preset-env').default,
				{
					exclude: [
						// Exclude transforms that make all code slower
						'transform-typeof-symbol',
						// Exclude chunky/costly transforms
						'transform-regenerator'
					],
					forceAllTransforms: es5Standalone
				}
			],
			[
				require('@babel/preset-react').default,
				{
					// Adds component stack to warning messages
					// Adds __self attribute to JSX which React will use for some warnings
					development: env !== 'production' && !es5Standalone,
					runtime: 'automatic'
				}
			],
			[require('@babel/preset-typescript').default]
		],
		plugins: [
			[
				require('babel-plugin-polyfill-corejs3'),
				{
					method: 'entry-global',
					exclude: [
						// Ignore web features since window and DOM is not available
						// in a V8 snapshot blob.
						// TODO: investigates ways to include but delay loading.
						'web.dom-collections.for-each',
						'web.dom-collections.iterator',
						'web.immediate',
						'web.queue-microtask',
						'web.timers',
						'web.url',
						'web.url.to-json',
						'web.url-search-params'
					],
					version: require('./package.json').dependencies['core-js']
				}
			],
			// Stage 0
			// '@babel/plugin-proposal-function-bind',

			// Stage 1
			require('@babel/plugin-proposal-export-default-from').default,
			// '@babel/plugin-proposal-logical-assignment-operators',
			// ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
			// '@babel/plugin-proposal-do-expressions',

			// Stage 2
			[require('@babel/plugin-proposal-decorators').default, false],
			require('@babel/plugin-transform-export-namespace-from').default,
			require('@babel/plugin-transform-numeric-separator').default,
			// '@babel/plugin-proposal-function-sent',
			// '@babel/plugin-proposal-throw-expressions',

			// Stage 3
			[require('@babel/plugin-transform-class-properties').default, {loose: true}],
			[require('@babel/plugin-transform-private-methods').default, {privateFieldsAsProperties: true}],
			[require('@babel/plugin-transform-private-property-in-object').default, {privateFieldsAsProperties: true}],
			// '@babel/plugin-syntax-import-meta',
			// '@babel/plugin-proposal-json-strings'

			// Soon to be included within pre-env; include here until then
			require('@babel/plugin-transform-optional-chaining').default,
			require('@babel/plugin-transform-nullish-coalescing-operator').default,

			!es5Standalone && [
				require('@babel/plugin-transform-runtime').default,
				{
					corejs: false,
					// Explicitly resolve runtime version to avoid issue
					// https://github.com/babel/babel/issues/10261
					version: require('@babel/runtime/package.json').version,
					// @remove-on-eject-begin
					// Undocumented option to use CLI-contained runtime, ensuring
					// the correct version
					absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
					// @remove-on-eject-end
				}
			],

			env === 'production' &&
				!es5Standalone && [
					require('babel-plugin-transform-react-remove-prop-types').default,
					{removeImport: true}
				]
		].filter(Boolean),
		overrides: [
			{
				test: /\.tsx?$/,
				plugins: [[require('@babel/plugin-proposal-decorators').default, {version: 'legacy'}]]
			}
		]
	};
};
