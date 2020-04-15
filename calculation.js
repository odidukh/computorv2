module.exports = calculation;
const real = require('./real');
const complex = require('./complex_calculation');
const matrix = require('./matrix');

function unintroducedVariablesCheck(expression) {
	let variables = expression.split(/[^a-zA-Z]/).filter(n => n);
	let savedVars = Object.keys(savedVariables);

	for (let i = 0; i < variables.length; i++) {
		if (!(savedVars.includes(variables[i])) && variables[i] !== 'i') {
			printOutput("Error: unintroduced variable used '" + variables[i] + "'");
			return true;
		}
	}
	return false;
}

function otherTypesCalculations(expression, left = null) {
	if (expression.includes('[')
		&& expression.split(/[^a-zA-Z]/).filter(n => n).includes('i')) {
		printOutput("Error: cannot perform with matrices and complex numbers");
		return null;
	}
	if (expression.includes('[')) {
		if (left) {
			matrix.matrix(left, matrix.matricesOperations(expression))
		} else {
			if (matrix.matricesOperations(expression)) {
				let matrixValue = matrix.matricesOperations(expression);
				matrixValue = matrixValue.substr(1, matrixValue.length - 2);
				matrixValue = matrixValue.split(';');
				matrixValue.forEach(row => {
					printOutput('[ ' + row.substring(1, row.length - 1).split(',').join(' , ') + ' ]');
				});
			}
		}
	}
	if (expression.includes('i')) {
		let complexRes = complex(expression);
		if (complexRes)
			printOutput(complexRes)
	}
}

function calculation(expression, left = null) {
	expression = convert(expression).split(' ').join('');
	if (unintroducedVariablesCheck(expression))
		return null;
	if (expression.includes('[')
		|| expression.split(/[^a-zA-Z]/).filter(n => n).includes('i')) {
		otherTypesCalculations(expression, left);
		return null;
	}
	else
		return real(expression);
}