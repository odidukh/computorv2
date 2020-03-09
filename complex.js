module.exports = {
	complex,
	complexOperation
};

function complexOperation(expression) {

}

function powerComplex(a, b, power) {
	let result = [1, 0];

	function multiply(a, b, c, d) {
		let realPart = a * c - b * d;
		let imaginaryPart = a * d + b * c;
		return [realPart, imaginaryPart];
	}

	for (let i = 0; i < power; i++) {
		result = multiply(result[0], result[1], a, b);
	}
	return result;
}

function complexArithmetic(complex1, complex2, operation) {
	let a = complex1.realPart;
	let b = complex1.imaginaryPart;
	let c = complex2.realPart;
	let d = complex2.imaginaryPart;

	let realPart;
	let imaginaryPart;

	function plus(a, b, c, d) {
		realPart = a + b;
		imaginaryPart = b + d;
	}

	function minus(a, b, c, d) {
		realPart = a - c;
		imaginaryPart = b - d;
	}

	function multiply(a, b, c, d) {
		realPart = a * c - b * d;
		imaginaryPart = a * d + b * c;
	}

	function divide(a, b, c, d) {
		let divider = c * c + d * d;
		realPart = (a * c + b * d) / divider;
		imaginaryPart = (b * c - a * d) / divider;
	}

	switch (operation) {
		case '+':
			plus(a,b,c,d);
			break;
		case '-':
			minus(a,b,c,d);
			break;
		case '*':
			multiply(a,b,c,d);
			break;
		case '/':
			divide(a,b,c,d);
			break;
	}

	return [realPart, imaginaryPart];
}

function printComplex(varName, realPart, imaginaryPart) {
	let sign = '+ ';

	if (imaginaryPart < 0) {
		imaginaryPart = -imaginaryPart;
		sign = '- '
	}
	if (imaginaryPart === 1) {
		imaginaryPart = '';
	}
	if (imaginaryPart === 0) {
		return realPart;
	}
	savedVariables[varName].value = realPart.toString() + ' ' + sign + imaginaryPart.toString() + 'i';
	printOutput(savedVariables[varName].value);
}

function complex(varName, value) {
	savedVariables[varName] = {};
	savedVariables[varName].type = 'complex';
	let step = 0;
	let tempValue = value;
	for (let i = 0; i < tempValue.length; i++) {
		if (tempValue[i]  === '-') {
			value = value.substring(0, i + step) + '+' + value.substring(i + step);
			step++;
		}
	}
	let expression = String(value).split('+');
	let realPart = 0;
	let imaginaryPart = 0;
	expression.forEach(part => {
		if (part.includes('i')) {
			part = part.replace(new RegExp('i'), '');
			if (part === '-') {
				part = '-1';
			}
			if (part === '') {
				part = '1';
			}
			imaginaryPart += parseFloat(part);
		} else {
			if (part !== '') {
				realPart += parseFloat(part);
			}
		}
	});
	savedVariables[varName].realPart = realPart;
	savedVariables[varName].imaginaryPart = imaginaryPart;
	printComplex(varName, realPart, imaginaryPart);
}