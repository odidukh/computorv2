module.exports = calculation;
const validator = require('./complex_validation');
const realNumCalc = require('./real');

function imaginaryPartComp(expression) {
	return parseFloat(expression);
}

function combineRealAndImaginary(realPart, imaginaryPart) {
	console.log(realPart, imaginaryPart)
	let computedExp =  "";
	if (realPart !== 0)
		computedExp = computedExp + realPart;

	console.log(computedExp.length)

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
	if (validator())
		return ;
	let computedExp = expression;

	computedExp = computedExp.replace(/-/g, "+-");

	computedExp = computedExp.split('+');

	let realPart = 0;
	let imaginaryPart = 0;

	for (let i = 0; i < computedExp.length; i++) {
		let element = computedExp[i];
		if (element.includes('i'))
			imaginaryPart += imaginaryPartComp(element);
		else
			realPart += realNumCalc(element);
	}

	return combineRealAndImaginary(realPart, imaginaryPart);
}