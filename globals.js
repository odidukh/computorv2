global['savedVariables'] = {};

global['history'] = '';

global['keyWords'] = ['keywords', 'variables', 'history', 'exit'];

global['saveToHistory'] = function (textToSave) {
	textToSave = '> ' + textToSave;
	if (history.length !== 0) {
		textToSave = '\n' + textToSave;
	}
	history += textToSave;
};

global['printOutput'] = function (output) {
	saveToHistory(output);
	console.log(output);
};

global['processKeyWords'] = function (keyWord) {
	switch (keyWord) {
		case 'keywords':
			keyWords.forEach(keyWord => {
				printOutput('> ' + keyWord);
			});
			break;
		case 'variables':
			if (Object.keys(savedVariables).length === 0) {
				printOutput("> No saved variables!")
			} else {
				Object.entries(savedVariables).forEach(([key, value]) => {
					if (savedVariables[key].type === 'function')
						key = key + '(' + savedVariables[key].variableName + ')';
					printOutput('> ' + key + ' = ' + value.value);
				})
			}
			break;
		case 'history':
			printOutput(history);
			break;
		case 'exit':
			process.stdout.write('Bye!');
			process.exit(0);
			break;
	}
};

global['isBalanced'] = function (expr) {
	let holder = [];
	let openBrackets = ['(', '['];
	let closedBrackets = [')', ']'];
	for (let letter of expr) {
		if (openBrackets.includes(letter)) {
			holder.push(letter)
		} else if (closedBrackets.includes(letter)) {
			let openPair = openBrackets[closedBrackets.indexOf(letter)];
			if (holder[holder.length - 1] === openPair) {
				holder.splice(-1, 1)
			} else {
				holder.push(letter);
				break
			}
		}
	}
	return (holder.length === 0)
};

global['replaceVarNameWithItsValue'] = function (expression) {
	Object.keys(savedVariables).forEach(varName => {
		if (expression.match(new RegExp("\\b" + varName + "\\b")) !== null) {
			expression = expression.replace(new RegExp("\\b" + varName + "\\b",  'g'),
				savedVariables[varName].value);
		}
	});
	return expression;
};

global['convert'] = function (expression) {
	function realNumConverter(expression) {
		let variables = expression.split(/[^a-zA-Z]/).filter(n => n);
		Object.keys(savedVariables).forEach(varName => {
			if (variables.includes(varName)
				&& savedVariables[varName].type === 'real') {
				expression = expression.replace(new RegExp("\\b" + varName + "\\b",  'g'),
					'(' + savedVariables[varName].value + ')');
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
					funcExp = funcExp.replace(new RegExp("\\b" + functionVariable + "\\b", 'g'), replaceVariable);
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