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