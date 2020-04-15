module.exports = {
	functionParser
};

function isCharNumber(c){
	return c >= '0' && c <= '9';
}

// function checkInput(funcName, func) {
// 	if (func.includes('[')) {
// 		printOutput("Error: function cannot contain matrices");
// 		return true;
// 	}
// 	let variables = func.split(/[^a-zA-Z]/).filter(n => n);
// 	if (variables.includes('i')) {
// 		printOutput("Error: function expression cannot contain complexes");
// 		return true;
// 	}
// 	return false;
// }

function functionParser(funcName, func) {
	func = convert(func);
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