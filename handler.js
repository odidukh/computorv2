module.exports = handler;
const computeLeftExpression = require('./calculation');
const solveQuadricEquation = require('./quadric_equation/equation_solver');
const saveVariablesToDB = require('./saver');

function handler(expression) {
	expression = expression.toLowerCase().split('=');
	let left = expression[0];
	let right = expression[1];
	if (right.includes('?')) {
		if (right === '?') {
			if (computeLeftExpression(left))
				printOutput(computeLeftExpression(left));
		} else
			solveQuadricEquation(left, right);
	} else {
		saveVariablesToDB(left, right);
	}
}