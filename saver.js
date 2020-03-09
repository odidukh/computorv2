module.exports = saveToDB;
const calculations = require('./calculation');
const matrix = require('./matrix');
const complex = require("./complex");
const functionParser = require("./function");

function checkVarName(varName) {
	if (!(/^[a-z()]+$/.test(varName))) {
		printOutput("Error: variable names can only contain letters");
		return false;
	}

	if (varName === 'i') {
		printOutput("Error: 'i' cannot be variable name");
		return false;
	}

	if (!(isBalanced(varName))) {
		printOutput("Error: wrong function declaration format - must contain '()'");
		return false;
	}
	if (varName.charAt(0) === '(' ||
		(varName.includes(')') && varName.charAt(varName.length - 1) !== ')')) {
		printOutput("Error: wrong function declaration format - wrong '()' position");
		return false;
	}
	if (varName.includes('(')) {
		let regExp = /\(([^)]+)\)/;
		let matches = regExp.exec(varName);

		if (!(matches && matches[1].length !== 0)) {
			printOutput("Error: no variable name in function declaration");
			return false;
		}
		let functionVar = matches[1];
		if (Object.keys(savedVariables).includes(functionVar)) {
			printOutput("Error: function variable is already booked");
			return false;
		}
	}
	let functionVariables = [];
	Object.keys(savedVariables).forEach(varName => {
		if (savedVariables[varName].type === 'function')
			functionVariables.push(savedVariables[varName].variableName)
	});
	if (functionVariables.includes(varName)) {
		printOutput("Error: '" + varName + "' is already function parameter")
		return false;
	}
	return true;
}


function saveToDB(left, right) {
	function selectDataType(left, right) {
		if (left.includes('(')) {
			functionParser.functionParser(left, right);
		} else if (right.includes('[')) {
			matrix.matrix(left, right);
		} else if (right.includes('i')) {
			complex.complex(left, right);
		} else {
			if (calculations(right) !== null) {
				savedVariables[left] = {};
				savedVariables[left].type = 'real';
				savedVariables[left].value = calculations(right);
				printOutput(savedVariables[left].value);
			}
		}
	}

	if (checkVarName(left)) {
			selectDataType(left, right)
	}
}