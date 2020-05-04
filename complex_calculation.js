module.exports = calculation;
const validator = require('./complex_validation');
const realNumCalc = require('./real');


function iToPower(expression) {
	let coefficient = 1;
	let result = 1;
	if (expression[0] !== 'i') {
		coefficient = parseFloat(expression);
		expression = expression.substr(expression.indexOf('i'));
	}
	while (expression.includes('^')) {
		expression = expression.split('^');
		switch (expression[1] % 4) {
			case 1:
				expression[1] = 'i';
				break;
			case 2:
				result = '-1';
				return result * coefficient;
			case 3:
				expression[1] = 'i';
				coefficient *= -1;
				break;
			case 0:
				result = '1';
				return result * coefficient;
		}
		expression = expression.shift().join('^')
	}
	return coefficient.toString() + expression;
}

function imaginaryNumCalc(expression) {
	if (expression === 'i')
		return '1i';
	if (expression === '-i')
		return '-1i';

	expression = expression.split('*');
	if (expression.length === 1)
		return expression[0];
	let multiplyRes = 1;
	for (let i = 0; i < expression.length; i++) {
		if (expression[i].includes('/')) {
			expression[i] = expression[i].split('/');
			for (let j = 0; j < expression[i].length; j++) {
				if (expression[i][j].includes('^')) {
					if (expression[i][j].includes('i'))
						expression[i][j] = iToPower(expression[i][j])
					else
						expression[i][j] = realNumCalc(expression[i][j]);
				}
			}
		} else {
			if (expression[i].includes('^')) {
				if (expression[i].includes('i'))
					expression[i] = iToPower(expression[i][j])
				else
					expression[i] = realNumCalc(expression[i][j]);
			}
		}
		if (!expression[i].includes('/') && !expression[i].includes('^')) {
			if (multiplyRes.toString().includes('i')) {
				if (expression[i].includes('i')) {
					if (expression[i] === 'i')
						expression[i] = 1
					if (expression[i] === '-i')
						expression[i] = -1;
					multiplyRes = parseFloat(multiplyRes.toString()) * parseFloat(expression[i]) * (-1);
				}
			} else {
				if (expression[i].includes('i')) {
					if (expression[i] === 'i')
						expression[i] = 1
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