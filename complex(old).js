module.exports = {
    complex,
    complexOperation
};

function multiplication(num1, num2) {
    let product;
    if (num1 === 'i' && num2 === 'i' || num1 === '-i' && num2 === '-i')
        return (-1);
    if (num1 === 'i' && num2 === '-i' || num1 === '-i' && num2 === 'i')
        return (1);
    if (num1 === 'i')
        return num2 + 'i';
    if (num1 === '-i')
        return -num2 + 'i';
    if (num2 === 'i')
        return num1 + 'i';
    if (num2 === '-i')
        return -num1 + 'i';

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
    console.log(num1, num2)
    let quotient;
    if (num1 === 'i' && num2 === 'i')
        return 1;
    if (num1.includes('i')) {
    	if (num1 === 'i' && num2.includes('i') && num2 !== 'i')
    		return 
	}
    if (!num1.includes('i') && num2 === 'i')
        return -num2 + 'i';
    if (num1.includes('i') && !num2.includes('i'))
        return parseFloat(num1) / num2 + 'i';
    if (num1.includes('i') && num2.includes('i')) {
        return parseFloat(num1) / parseFloat(num2);
    }
    quotient = num1 / num2;

    return quotient;
}

function complexOperation(expression) {
    console.log(expression);

    if (expression.includes('%')) {
        printOutput("Error: complex number operations don't support modulo operator");
        return null;
    }

    let step = 0;
    let tempExpression = expression;
    for (let i = 0; i < tempExpression.length; i++) {
        if (tempExpression[i] === '-') {
            expression = expression.substring(0, i + step) + '+' + expression.substring(i + step);
            step++;
        }
    }

    printOutput("Result = " + bracketOpener(expression));

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
        return (computation(expression));
    }

    function computation(expression) {
        let real = 0;
        let imaginary = 0;

        expression = expression.split('+');
        console.log(expression);
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
                        leftPart = leftPart.substring(leftPart.indexOf(operationSign) + 1);
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
                let temp = 0;
                if (leftPart === 'i') {
                    let remainder = rightPart / 4;
                    if (rightPart < 3)
                        remainder = rightPart;
                    switch (remainder) {
                        case '1':
                            temp = 'i';
                            break;
                        case '2':
                            temp = '-1';
                            break;
                        case '3':
                            temp = '-i';
                            break;
                        case '0':
                            temp = '1';
                            break;
                    }
                }
                if (temp === 0)
                    temp = power(parseFloat(leftPart), parseFloat(rightPart));
                expression[i] = leftPartRemain + temp + rightPartRemain;
            }
            while (String(expression[i]).match(/[*\/]/)) {
                let calcRes = 0;
                let sign1 = null;
                let signOneIndex = 0;
                let sign2 = null;
                let signTwoIndex = 0;
                for (let j = 0; j < expression[i].length; j++) {
                    let char = expression[i][j];
                    if (char === '*' || char === '/') {
                        if (sign1 === null) {
                            sign1 = char;
                            signOneIndex = j;
                        } else {
                            sign2 = char;
                            signTwoIndex = j;
                            break;
                        }
                    }
                }
                let number;
                if (sign2)
                    number = expression[i].substring(0, signTwoIndex);

                let operationalString = expression[i];
                if (sign2)
                    operationalString = number;

                operationalString = operationalString.split(sign1);
                switch (sign1) {
                    case '*':
                        calcRes = multiplication(operationalString[0], operationalString[1]);
                        break;
                    case '/':
                        calcRes = division(operationalString[0], operationalString[1]);
                        break;
                }
                if (sign2)
                    expression[i] = calcRes + expression[i].substring(signTwoIndex);
                else
                    expression[i] = calcRes;
            }
            expression.forEach(number => {
                if (number !== '') {
                    if (String(expression[i]).includes('i'))
                        imaginary += parseFloat(expression[i]);
                    else
                        real += parseFloat(expression[i]);
                }
            });
        }
        console.log("Complex num: " + real + '+' + imaginary + 'i');
        if (imaginary === 0) {
            return real === '0' ? 0 : real;
        }
        if (real === 0)
            return imaginary + '*i';
        else if (imaginary > 0) {
            return real + '+' + imaginary + '*i';
        } else {
            return real + imaginary + '*i';
        }
    }
}

// function powerComplex(a, b, power) {
// 	let result = [1, 0];
//
// 	function multiply(a, b, c, d) {
// 		let realPart = a * c - b * d;
// 		let imaginaryPart = a * d + b * c;
// 		return [realPart, imaginaryPart];
// 	}
//
// 	for (let i = 0; i < power; i++) {
// 		result = multiply(result[0], result[1], a, b);
// 	}
// 	return result;
// }
//
// function complexArithmetic(complex1, complex2, operation) {
// 	let a = complex1.realPart;
// 	let b = complex1.imaginaryPart;
// 	let c = complex2.realPart;
// 	let d = complex2.imaginaryPart;
//
// 	let realPart;
// 	let imaginaryPart;
//
// 	function plus(a, b, c, d) {
// 		realPart = a + b;
// 		imaginaryPart = b + d;
// 	}
//
// 	function minus(a, b, c, d) {
// 		realPart = a - c;
// 		imaginaryPart = b - d;
// 	}
//
// 	function multiply(a, b, c, d) {
// 		realPart = a * c - b * d;
// 		imaginaryPart = a * d + b * c;
// 	}
//
// 	function divide(a, b, c, d) {
// 		let divider = c * c + d * d;
// 		realPart = (a * c + b * d) / divider;
// 		imaginaryPart = (b * c - a * d) / divider;
// 	}
//
// 	switch (operation) {
// 		case '+':
// 			plus(a,b,c,d);
// 			break;
// 		case '-':
// 			minus(a,b,c,d);
// 			break;
// 		case '*':
// 			multiply(a,b,c,d);
// 			break;
// 		case '/':
// 			divide(a,b,c,d);
// 			break;
// 	}
//
// 	return [realPart, imaginaryPart];
// }

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
        if (tempValue[i] === '-') {
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