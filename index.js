/*
 *  babel.config.js
 *
 *  A Babel javascript configuration dynamically setup for Enact
 *  development environment on target platforms.
 */
const path = require('path');

// Check if JSX transform is able
const hasJsxRuntime = (() => {
	if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
		return false;
	}

	try {
		require.resolve('react/jsx-runtime');
		return true;
	} catch (e) {
		return false;
	}
})();

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
						'transform-regenerator',
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
					forceAllTransforms: es5Standalone,
					loose: true,
					modules: env === 'test' && !es5Standalone ? 'commonjs' : false,
					useBuiltIns: 'entry',
					corejs: '3.19'
				}
			],
			[
				require('@babel/preset-react').default,
				{
					// Adds component stack to warning messages
					// Adds __self attribute to JSX which React will use for some warnings
					development: env !== 'production' && !es5Standalone,
					// Will use the native built-in instead of trying to polyfill
					// behavior for any plugins that require one.
					...(!hasJsxRuntime ? {useBuiltIns: true} : {runtime: 'automatic'})
				}
			],
			[require('@babel/preset-typescript').default]
		],
		plugins: [
			// Stage 1
			require('@babel/plugin-proposal-export-default-from').default,

			// Stage 2
			[require('@babel/plugin-proposal-decorators').default, false],

			!es5Standalone && [
				require('@babel/plugin-transform-runtime').default,
				{
					corejs: false,
					helpers: true,
					// Explicitly resolve runtime version to avoid issue
					// https://github.com/babel/babel/issues/10261
					version: require('@babel/runtime/package.json').version,
					regenerator: false,
					// @remove-on-eject-begin
					// Undocumented option to use CLI-contained runtime, ensuring
					// the correct version
					absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
					// @remove-on-eject-end
				}
			],

			require('babel-plugin-dev-expression'),
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
