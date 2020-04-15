module.exports = {
	matrix,
	matricesOperations
};

const allowedChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '[', ']', '+', '*', ',', ';', '.'];

function checkSyntax(expression) {
	function forbiddenChars(expression) {
		for (let i = 0; i < expression.length; i++) {
			if (!(allowedChars.includes(expression[i]))) {
				printOutput("Error: matrices don't support '" +
					expression[i] + "' char");
				return true;
			}
		}
		return false;
	}

	function semicolonsCheck(expression) {
		let splited = expression.split(';');
		for (let i = 0; i < splited.length; i++) {
			if (!splited[i]) {
				printOutput("Error: wrong ';' position. Check input");
				return true;
			}
			if (splited[i].charAt(0) !== '['
				|| splited[i].charAt(splited[i].length - 1) !== ']') {
				printOutput("Error: wrong ';' position. Check input");
				return true;
			}
		}
		return false;
	}

	if (forbiddenChars(expression))
		return true;
	if (!(isBalanced(expression))) {
		printOutput("Error: unsupported syntax. Check your input.");
		return true
	}
	return semicolonsCheck(expression);

}

function matricesOperations(expression) {
	let addingArray = [];
	let splited = expression.split('+');
	for (let part of expression.split(/[+*]/)) {
		if (part.includes('[') && checkSyntax(part))
			return null;
	}
	for (let part of splited) {
		if (part.includes('*')) {
			if (multiplication(part))
				addingArray.push(multiplication(part));
			else
				return null;
		} else
			addingArray.push(part);
	}
	for (const term of addingArray) {
		if (!term.includes('[')) {
			printOutput("Error: cannot add scalar to matrix");
			return null;
		}
	}
	if (addingArray.length > 1) {
		for (let i = 0; i < addingArray.length - 1; i++) {
			let firstMatr = addingArray[i];
			let secondMatr = addingArray[i + 1];
			addingArray[i + 1] = addMatrices(eval(firstMatr.split(';').join(',')), eval(secondMatr.split(';').join(',')));
		}
	}
	return addingArray[addingArray.length - 1];
}

function checkIfMatrix(expression) {
	if (expression.length < 5) {
		printOutput("Error: Wrong input.");
		return true;
	}
	if (expression[0] !== '[' && expression[expression.length - 1] !== ']') {
		printOutput("Error: Wrong brackets position.");
		return true;
	}
	expression = expression.substring(1, expression.length - 1);
	expression = expression.split(';');
	for (let i = 0; i < expression.length - 1; i++) {
		let currentRow = expression[i];
		let nextRow = expression[i + 1];
		if (currentRow[0] !== '[' && currentRow[currentRow.length - 1] !== ']') {
			printOutput("Error: Wrong brackets position.");
			return true;
		}
		if (nextRow[0] !== '[' && nextRow[nextRow.length - 1] !== ']') {
			printOutput("Error: Wrong brackets position.");
			return true;
		}
		if (currentRow.split(',').length !== nextRow.split(',').length) {
			printOutput("Error: different number elements in matrix rows");
			return true;
		}
	}
	return false;
}

function format2D(a) {
	let str = "[";
	for (let i = 0; i < a.length; i++) {
		str += "[" + a[i].toString() + "];";
	}
	str = str.substr(0, str.length - 1);
	str += "]";
	return str;
}

function multiplication(expression) {
	expression = convert(expression).split('*');
	for (const elem of expression) {
		if (elem.includes('[') && (checkSyntax(elem) || checkIfMatrix(elem)))
			return null;
	}
	for (let i = 0; i < expression.length - 1; i++) {
		let firstElem = expression[i];
		let secondElem = expression[i + 1];
		if (firstElem.includes('[') && secondElem.includes('['))
			expression[i + 1] = multiplyMatrix(eval(firstElem.split(';').join(',')),
				eval(secondElem.split(';').join(',')));
		else if (firstElem.includes('[') && !secondElem.includes('['))
			expression[i + 1] = multiplyMatrixByNumber(parseFloat(secondElem), eval(firstElem.split(';').join(',')));
		else if (!firstElem.includes('[') && secondElem.includes('['))
			expression[i + 1] = multiplyMatrixByNumber(parseFloat(firstElem), eval(secondElem.split(';').join(',')));
		else
			expression[i + 1] = parseFloat(firstElem) * parseFloat(secondElem);
	}
	return expression[expression.length - 1];
}

function multiplyMatrixByNumber(number, matrix) {
	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			matrix[i][j] = matrix[i][j] * number;
		}
	}
	return format2D(matrix);
}

function multiplyMatrix(matrixA, matrixB) {
	function checkIfMultiplicationPossible(matrixA, matrixB) {
		if (matrixA[0].length !== matrixB.length) {
			printOutput("Error: Dimension of matrices don't match, cannot multiply")
			return false;
		}
		return true;
	}

	if (!checkIfMultiplicationPossible(matrixA, matrixB))
		return null;
	let aNumRows = matrixA.length;
	let aNumCols = matrixA[0].length;
	let bNumCols = matrixB[0].length;
	let m = new Array(aNumRows);  // initialize array of rows
	for (let r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols); // initialize the current row
		for (let c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;             // initialize the current cell
			for (let i = 0; i < aNumCols; ++i) {
				m[r][c] += matrixA[r][i] * matrixB[i][c];
			}
		}
	}
	return format2D(m);
}

function addMatrices(matrixA, matrixB) {
	function checkMatricesAddition(matrixA, matrixB) {
		if (matrixA[0].length !== matrixB[0].length
			&& matrixA.length !== matrixB.length) {
			printOutput("Error: matrices cannot be added. Not same dimensions");
			return true;
		}
		return false;
	}

	if (checkMatricesAddition(matrixA, matrixB))
		return null;
	for (let i = 0; i < matrixA.length; i++) {
		for (let j = 0; j < matrixA[0].length; j++) {
			matrixA[i][j] = matrixA[i][j] + matrixB[i][j];
		}
	}
	return format2D(matrixA);
}

function matrix(left, right) {
	function checkMatrixSyntax(expression) {
		let bracketsSignStr = expression.replace(/[^\[]/g, '');
		if (bracketsSignStr.length < 2) {
			printOutput("Syntax error: wrong matrix syntax - wrong '[]' count. Check input");
			return false;

		}
		return true;
	}

	if (checkMatrixSyntax(right) && (right = matricesOperations(right))) {
		savedVariables[left] = {};
		savedVariables[left].type = 'matrix';
		savedVariables[left].value = right;
		matrix = savedVariables[left].value.split(';');
		savedVariables[left].rows = matrix.length;
		savedVariables[left].columns = matrix[0].split(',').length;
		if (savedVariables[left].rows === 1 && savedVariables[left].columns === 1) {
			savedVariables[left] = {};
			savedVariables[left].type = 'real';
			savedVariables[left].value = parseFloat(matrix[0].substring(2, matrix[0].length - 2));
			printOutput(savedVariables[left].value);
		} else {
			let matrix = savedVariables[left].value.substr(1, savedVariables[left].value.length - 2);
			matrix = matrix.split(';');
			matrix.forEach(row => {
				printOutput('[ ' + row.substring(1, row.length - 1).split(',').join(' , ') + ' ]');
			});
		}
	}
}