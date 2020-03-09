module.exports = real;

function multiplication(num1, num2) {
	let product;
	product = num1 * num2;

	return product;
}

function power(number, power) {
	let result = 1;
	for (let i = 0; i < power; i++) {
		result = result * number;
	}
	return result;
}


function division(num1, num2) {
	let quotient;
	quotient = num1 / num2;

	return quotient;
}

function modulo(num1, num2) {
	let remainder;
	remainder = num1 % num2;

	return remainder;
}

function computations(expression) {
	expression = String(expression).replace('--', '').split('+');
	let result = 0;
	for (let i = 0; i < expression.length; i++) {
		while (String(expression[i]).match(/\^/)) {
			let leftPart = expression[i].substring(0, expression[i].indexOf('^'));
			let rightPart = expression[i].substring(expression[i].indexOf('^') + 1);
			let rightPartRemain = '';
			let leftPartRemain = '';
			for (let j = leftPart.length - 1; j >= 0; j--) {
				let operationSign = leftPart[j];
				if (operationSign === '*' || operationSign === '/'
					|| operationSign === '%' || operationSign === '^') {
					leftPartRemain = leftPart.substring(0, leftPart.indexOf(operationSign) + 1);
					leftPart = leftPart.substring(leftPart.indexOf(operationSign) + 1)
					break;
				}
			}
			for (let j = 0; j < rightPart.length; j++) {
				let operationSign = rightPart[j];
				if (operationSign === '*' || operationSign === '/'
					|| operationSign === '%' || operationSign === '^') {
					rightPartRemain = rightPart.substring(rightPart.indexOf(operationSign));
					rightPart = rightPart.substring(0, rightPart.indexOf(operationSign));
					break;
				}
			}
			expression[i] = leftPartRemain + power(parseFloat(leftPart), parseFloat(rightPart)) + rightPartRemain;
		}
		while (String(expression[i]).match(/[*%\/]/)) {
			let calcRes = 0;
			let sign1 = null;
			let sign2 = null;
			for (let j = 0; j < expression[i].length; j++) {
				let char = expression[i][j];
				if (char === '*' || char === '/' || char === '%') {
					if (sign1 === null) {
						sign1 = char;
					} else {
						sign2 = char;
						break;
					}
				}
			}
			let number;
			if (sign2) {
				number = expression[i].substring(0, expression[i].indexOf(sign2));
			}

			let operationalString = expression[i];
			if (sign2) {
				operationalString = number;
			}
			operationalString = operationalString.split(sign1);
			switch (sign1) {
				case '*':
					calcRes = multiplication(parseFloat(operationalString[0]), parseFloat(operationalString[1]));
					break;
				case '/':
					calcRes = division(parseFloat(operationalString[0]), parseFloat(operationalString[1]));
					break;
				case '%':
					calcRes = modulo(parseFloat(operationalString[0]), parseFloat(operationalString[1]));
					break;
			}
			if (sign2) {
				expression[i] = calcRes + expression[i].substring(expression[i].indexOf(sign2) + 1);
			} else {
				expression[i] = calcRes;
			}
		}
	}
	expression.forEach(number => {
		if (number !== "")
			result += parseFloat(number);
	});
	return result;
}

function findClosingBracket(str, pos) {
	const rExp = /[()]/g;
	rExp.lastIndex = pos + 1;
	let deep = 1;
	while ((pos = rExp.exec(str))) {
		if (!(deep += str[pos.index] === "(" ? 1 : -1)) {
			return pos.index
		}
	}
}

function bracketOpener(expression) {
	while (expression.includes('(')) {
		expression = expression.substring(0, expression.indexOf('(')) +
			bracketOpener(expression.substring(expression.indexOf('(') + 1,
				findClosingBracket(expression, expression.indexOf('(')))) +
			expression.substring(findClosingBracket(expression, expression.indexOf('(')) + 1);
	}
	return (computations(expression));
}


function real(expression) {
	let step = 0;
	let tempExpression = expression;
	for (let i = 0; i < tempExpression.length; i++) {
		if (tempExpression[i] === '-') {
			expression = expression.substring(0, i + step) + '+' + expression.substring(i + step);
			step++;
		}
	}
	return bracketOpener(expression);
}