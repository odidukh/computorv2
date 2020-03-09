module.exports = {
	functionParser
};

function isCharNumber(c){
	return c >= '0' && c <= '9';
}

function checkInput(funcName, func) {
	if (func.includes('[')) {
		printOutput("Error: function cannot contain matrices")
		return true;
	}
	let variables = func.split(/[^a-zA-Z]/).filter(n => n);
	if (variables.includes('i')) {
		printOutput("Error: function expression cannot contain complexes");
		return true;
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

	return expression;
}

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
				funcExp = funcExp.replace(new RegExp("\\b" + functionVariable + "\\b", 'g'), replaceVariable);
				let fullReplaceable = varName + replaceVariable;
				let fullReplacing = '(' + funcExp + ')';
				expression = expression.replace(fullReplaceable, fullReplacing);
			}
		}
	});
	return expression;
}

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

function functionParser(funcName, func) {
	func = convert(func);
	func = functionConverter(func);
	func = otherTypesConverter(func);
	if (checkInput(funcName, func))
		return null;
	let regExp = /\(([^)]+)\)/;
	let variableName = regExp.exec(funcName)[1];
	let splitedFunc = func.split(variableName);
	for (let i = 0; i < splitedFunc.length - 1; i++) {
		if (isCharNumber(splitedFunc[i].charAt(splitedFunc[i].length - 1))
			|| splitedFunc[i].charAt(splitedFunc[i].length - 1) === ')') {
			splitedFunc[i] = splitedFunc[i] + '*'
		}
	}
	func = splitedFunc.join(variableName);
	let symbols = ['+', '-', '*', '/', '%'];
	for (let i = 0; i < symbols.length; i++) {
		if(func.includes(symbols[i])) {
			func = func.split(symbols[i]).join(' ' + symbols[i] + ' ')
		}
	}

	let fullFunctionName = funcName;

	funcName = funcName.substring(0, funcName.indexOf('('));

	savedVariables[funcName] = {};

	savedVariables[funcName].type = 'function';
	savedVariables[funcName].variableName = variableName;
	savedVariables[funcName].fullFunctionName = fullFunctionName;
	savedVariables[funcName].value = func;
	printOutput(savedVariables[funcName].value)
}

function functionToValue(variables, input) {
	Object.keys(variables).forEach(variableName => {
		if (input.includes(variableName) && variables[variableName].functionName) {
			while (input.includes(variableName)) {
				let funcExp = variables[variableName].functionExpression;
				let functionVariable = variables[variableName].variableName;
				let roundBracketsCounter = 0;
				let replaceVariable = '';
				let substr = input.substring(input.indexOf(variableName) + variableName.length);
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
				funcExp = funcExp.replace(new RegExp("\\b" + functionVariable + "\\b", 'g'), replaceVariable);
				let fullReplaceable = variableName + replaceVariable;
				let fullReplacing = '(' + funcExp + ')';
				input = input.replace(fullReplaceable, fullReplacing);
			}
		}
	});
	return input;
}