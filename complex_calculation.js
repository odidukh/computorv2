module.exports = calculation;
const validator = require('./complex_validation');
const realNumCalc = require('./real');


function iToPower(expression) {
	let coefficient = '';
	let result = 1;
	if (expression[0] !== 'i') {
		coefficient = parseFloat(expression);
		expression = expression.substr(expression.indexOf('i'));
	}
	while (expression.includes('^')) {
		if (!expression.includes('i')) {
			console.log(coefficient * realNumCalc(expression))
			return coefficient * realNumCalc(expression);
		}
		expression = expression.split('^');
		switch (expression[1] % 4) {
			case 1:
				expression[1] = 'i';
				break;
			case 2:
				result = '-1';
				break;
			case 3:
				expression[1] = 'i';
				if (!coefficient)
					coefficient = 1;
				coefficient *= -1;
				break;
			case 0:
				result = '1';
				if (!coefficient)
					coefficient = 1;
				return coefficient;
		}
		expression.shift();
		console.log('expression after shift', expression);
		if (expression.length === 1)
			break;
		expression = expression.join('^');
		console.log("expression after join", expression)
	}
	if (result.toString().includes('i'))
		return coefficient.toString() + result;
	else
		return coefficient * result
}

function imaginaryNumCalc(expression) {
	if (expression === 'i')
		return '1i';
	if (expression === '-i')
		return '-1i';

	expression = expression.split('*');
	if (expression.length === 1 && !expression[0].includes('/')
		&& !expression[0].includes('^'))
		return expression[0];
	let multiplyRes = 1;
	for (let i = 0; i < expression.length; i++) {
		if (expression[i].includes('/')) {
			expression[i] = expression[i].split('/');
			for (let j = 0; j < expression[i].length; j++) {
				if (expression[i][j].includes('^')) {
					if (expression[i][j].includes('i'))
						expression[i][j] = iToPower(expression[i][j]);
					else
						expression[i][j] = realNumCalc(expression[i][j]);
				}
			}
		} else {
			if (expression[i].includes('^')) {
				if (expression[i].includes('i'))
					expression[i] = iToPower(expression[i]);
				else
					expression[i] = realNumCalc(expression[i]);
			}
		}
		if (!expression[i].toString().includes('/')
			&& !expression[i].toString().includes('^')) {
			if (multiplyRes.toString().includes('i')) {
				if (expression[i].includes('i')) {
					if (expression[i] === 'i')
						expression[i] = 1;
					if (expression[i] === '-i')
						expression[i] = -1;
					multiplyRes = parseFloat(multiplyRes.toString()) * parseFloat(expression[i]) * (-1);
				}
			} else {
				if (expression[i].toString().includes('i')) {
					if (expression[i] === 'i')
						expression[i] = 1;
					if (expression[i] === '-i')
						expression[i] = -1;
					multiplyRes = multiplyRes * parseFloat(expression[i]) + 'i';
				} else {
					multiplyRes = multiplyRes * expression[i];
				}
			}

		}
	}
	return multiplyRes;
}

function combineRealAndImaginary(realPart, imaginaryPart) {
	let computedExp = "";
	if (realPart === 0 && imaginaryPart === 0)
		return '0';
	if (realPart !== 0)
		computedExp = computedExp + realPart;

	if (imaginaryPart !== 0) {
		if (computedExp.length && imaginaryPart > 0)
			computedExp = computedExp + '+' + imaginaryPart + 'i';
		else if (computedExp.length && imaginaryPart < 0)
			computedExp = computedExp + imaginaryPart + 'i';
		else
			computedExp = imaginaryPart + 'i';
	}
	return computedExp;
}

function calculation(expression) {
	if (validator(expression))
		return;
	let computedExp = expression;

	computedExp = computedExp.replace(/-/g, "+-");

	computedExp = computedExp.split('+');

	let realPart = 0;
	let imaginaryPart = 0;

	for (let i = 0; i < computedExp.length; i++) {
		let element = computedExp[i];
		if (element.toString().includes('i')) {
			let result = imaginaryNumCalc(element);
			if (result.toString().includes('i'))
				imaginaryPart += parseFloat(result);
			else
				realPart += result;
		} else
			realPart += realNumCalc(element);
	}
	return combineRealAndImaginary(realPart, imaginaryPart);
}