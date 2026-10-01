/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copy of babel-plugin-dev-expression 0.2.3 (https://github.com/4Catalyzer/babel-plugin-dev-expression),
 * which only supports @babel/core 7 and is no longer maintained. Changed to create a new expression node for each
 * replacement instead of sharing a single node across the AST, and to only replace references to the global
 * `__DEV__` (not local bindings with the same name).
 *
 * - Replaces `__DEV__` with `process.env.NODE_ENV !== 'production'`
 * - Wraps `warning(...)` calls in a development check
 * - Moves `invariant(...)` messages behind a development check
 *
 * The expression is resolved by the app's bundler (webpack `DefinePlugin`), so transpiled packages keep working in
 * both development and production builds.
 */

module.exports = function ({types: t}) {
	const SEEN_SYMBOL = Symbol();

	const devExpression = () =>
		t.binaryExpression(
			'!==',
			t.memberExpression(
				t.memberExpression(t.identifier('process'), t.identifier('env')),
				t.identifier('NODE_ENV')
			),
			t.stringLiteral('production')
		);

	return {
		name: 'dev-expression',
		visitor: {
			Identifier: {
				enter(path) {
					// Do nothing when testing
					if (process.env.NODE_ENV === 'test') return;

					// Replace global __DEV__ with process.env.NODE_ENV !== 'production'. Unlike the original plugin,
					// identifiers bound to a local variable or parameter named __DEV__ are left untouched.
					if (
						path.isIdentifier({name: '__DEV__'}) &&
						path.isReferencedIdentifier() &&
						!path.scope.getBinding('__DEV__')
					) {
						path.replaceWith(devExpression());
					}
				}
			},
			CallExpression: {
				exit(path) {
					const node = path.node;

					// Do nothing when testing or when already processed
					if (process.env.NODE_ENV === 'test' || node[SEEN_SYMBOL]) return;

					if (path.get('callee').isIdentifier({name: 'invariant'})) {
						// invariant(condition, ...args) becomes:
						//
						// if (!condition) {
						//   if (process.env.NODE_ENV !== 'production') {
						//     invariant(false, ...args);
						//   } else {
						//     invariant(false);
						//   }
						// }
						const condition = node.arguments[0];
						const devInvariant = t.callExpression(
							t.cloneNode(node.callee),
							[t.booleanLiteral(false)].concat(node.arguments.slice(1))
						);
						devInvariant[SEEN_SYMBOL] = true;

						const prodInvariant = t.callExpression(t.cloneNode(node.callee), [t.booleanLiteral(false)]);
						prodInvariant[SEEN_SYMBOL] = true;

						path.replaceWith(
							t.ifStatement(
								t.unaryExpression('!', condition),
								t.blockStatement([
									t.ifStatement(
										devExpression(),
										t.blockStatement([t.expressionStatement(devInvariant)]),
										t.blockStatement([t.expressionStatement(prodInvariant)])
									)
								])
							)
						);
					} else if (path.get('callee').isIdentifier({name: 'warning'})) {
						// warning(condition, ...args) becomes:
						//
						// if (process.env.NODE_ENV !== 'production') {
						//   warning(condition, ...args);
						// }
						node[SEEN_SYMBOL] = true;

						path.replaceWith(
							t.ifStatement(devExpression(), t.blockStatement([t.expressionStatement(node)]))
						);
					}
				}
			}
		}
	};
};
