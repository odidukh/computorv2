module.exports = isValidInput;

const operationChars = ['+', '-', '*', '/', '%', '^'];
const separationChars = [',', '.', ';'];
const separationCharsWithoutSemicolon = ['.', ','];
const bracketsChars = ['(', ')', '[', ']'];
const closingBracketsChars = [')', ']'];
const openingBracketsChars = ['(', '['];

function equalSignCheck(input) {
	let equalSignStr = input.replace(/[^=]/g, '');
	if (equalSignStr.length > 1) {
		printOutput("Error: '=' sign must be single in the expression");
		return true;
	} else if (equalSignStr < 1) {
		printOutput("Error: there is no '=' sign in the expression");
		return true;
	}
	return false;
}

function questionMarkCheck(input) {
	if (input.includes('?')) {
		let questionMarkStr = input.replace(/[^?]/g, '');
		if (questionMarkStr.length > 1) {
			printOutput("Error: '?' sign must be single in the expression");
			return true;
		}
		if (input.split('=')[0].includes('?')) {
			printOutput("Error: '?' sign must be only after '=' sign");
			return true;
		}
	}
	return false;
}


function validCharCheck(input) {
	input = input.split(' ').join('');
	for (let i = 0; i < input.length; i++) {
		let char = input[i];
		if (char.match(/[a-zA-Z0-9.,;?()\[\]+\-*%^=/]/) === null) {
			printOutput("Error: input cannot contain '" + char + "' char");
			return true;
		}
	}
	return false;
}

function isBracketsBalancedCheck(input) {
	if (!isBalanced(input)) {
		printOutput('Error: the bracket are imbalanced. Check your input');
		return true;
	}
	return false;
}


function charPositionCheck(input) {
	input = input.split(' ').join('');
	for (let i = 0; i < input.length - 1; i++) {
		let char = input.charAt(i);
		let nextChar = input.charAt(i + 1);
		if (i === 0) {
			if ((operationChars.includes(char) && char !== '-')
				|| separationChars.includes(char)) {
				printOutput("Syntax Error: '" + input + "' cannot start with '" + char + "'");
				return true;
			}
		}
		let operationAndDelimiterChars = operationChars.concat(separationChars);
		if ((i + 1) === (input.length - 1)) {
			if (operationAndDelimiterChars.includes(nextChar)) {
				printOutput("Syntax Error: '" + input + "' cannot end with '" + nextChar + "'");
				return true;
			}
		}
		if (openingBracketsChars.includes(char)
			&& operationAndDelimiterChars.includes(nextChar) && nextChar !== '-') {
			printOutput("Syntax Error: '" + char + "' cannot be followed by '" + nextChar + "'");
			return true;
		}
		if (operationAndDelimiterChars.includes(char)
			&& (operationAndDelimiterChars.includes(nextChar) || closingBracketsChars.includes(nextChar))) {
			printOutput("Syntax Error: '" + char + "' cannot be followed by '" + nextChar + "'");
			return true;
		}
		if ((separationCharsWithoutSemicolon.includes(char)
			&& bracketsChars.includes(nextChar))
			|| (bracketsChars.includes(char) &&
			separationCharsWithoutSemicolon.includes(nextChar))) {
			printOutput("Syntax Error: '" + char + "' cannot be followed by '" + nextChar + "'");
			return true;
		}


		if ((char === ')' || char === ']') && (nextChar === '(' || nextChar === '[')) {
			printOutput("Syntax Error: '" + char + "' cannot be followed by '" + nextChar + "'");
			return true;
		}

	}
	return false;
}

function expressionCheck(input) {
	input = input.split(' ').join('').split('=');
	let left = input[0];
	let right = input[1];

	if (left.length === 0) {
		printOutput("Error: No expression before '='");
		return true
	}
	if (right.length === 0) {
		printOutput("Error: No expression after '='");
		return true
	}
	return false;
}

function isValidInput(input) {
	if (equalSignCheck(input)
		|| expressionCheck(input)
		|| questionMarkCheck(input))
		return  false;
	input = input.split('?').join('');
	return !(validCharCheck(input)
		|| isBracketsBalancedCheck(input)
		|| charPositionCheck(input.split('=')[0])
		|| charPositionCheck(input.split('=')[1]));

}