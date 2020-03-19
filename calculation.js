module.exports = calculation;
const real = require('./real');
const complex = require('./complex');
const matrix = require('./matrix');
const func = require('./function');

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

function convert(expression) {
	function realNumConverter(expression) {
		let variables = expression.split(/[^a-zA-Z]/).filter(n => n);
		Object.keys(savedVariables).forEach(varName => {
			if (variables.includes(varName)
				&& savedVariables[varName].type === 'real') {
				expression = expression.replace(new RegExp("\\b" + varName + "\\b",  'g'),
					savedVariables[varName].value);
			}
		});
		return expression;
	}
	expression = realNumConverter(expression);

	function functionConverter(expression) {
		let variables = expression.split(/[^a-zA-Z]/).filter(n => n);
		Object.keys(savedVariables).forEach(varName => {
			if (variables.includes(varName) &&
				savedVariables[varName].type === 'function') {
				while (expression.includes(varName)) {
					let funcExp = savedVariables[varName].value;
					let functionVariable = savedVariables[varName].variableName;
					let roundBracketsCounter = 0;
					let replaceVariable = '';
					let substr = expression.substring(expression.indexOf(varName) + varName.length);
					for (let i = 0; i < substr.length; i++) {
						if (substr.charAt(i) === '(') {
							roundBracketsCounter++;
						} else if (substr.charAt(i) === ')') {
							roundBracketsCounter--;
							if (roundBracketsCounter === 0) {
								replaceVariable = substr.substring(0, i + 1);
								break;
							}
						}
					}
					funcExp = funcExp.replace(new RegExp("\\b" + functionVariable + "\\b"), replaceVariable);
					let fullReplaceable = varName + replaceVariable;
					let fullReplacing = '(' + funcExp + ')';
					expression = expression.replace(fullReplaceable, fullReplacing);
				}
			}
		});
		return expression;
	}
	expression = functionConverter(expression);

	function otherTypesConverter(expression) {
		let variables = expression.split(/[^a-zA-Z]/).filter(n => n);
		Object.keys(savedVariables).forEach(varName => {
			if (variables.includes(varName)) {
				expression = expression.replace(new RegExp("\\b" + varName + "\\b",  'g'),
					savedVariables[varName].value);
			}
		});
		return expression;
	}
	expression = otherTypesConverter(expression);
	return expression;
}


function otherTypesCalculations(expression) {
	if (expression.includes('[')
		&& expression.split(/[^a-zA-Z]/).filter(n => n).includes('i')) {
		printOutput("Error: cannot perform with matrices and complex numbers");
		return null;
	}
	if (expression.includes('['))
		matrix.matricesOperations(expression);
	if (expression.includes('i'))
		complex.complexOperation(expression);
}

function calculation(expression) {
	expression = convert(expression).split(' ').join('');
	if (unintroducedVariablesCheck(expression))
		return null;
	if (expression.includes('[')
		|| expression.split(/[^a-zA-Z]/).filter(n => n).includes('i'))
		otherTypesCalculations(expression);
	else
		return real(expression);
}