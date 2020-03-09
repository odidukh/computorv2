module.exports = {
	matrix,
	matricesOperations
};

function matricesOperations() {

}

function multiplyMatrix(matrixA, matrixB) {
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
	return m;
}

function matrix(left, right) {
	function checkMatrixSyntax(expression) {
		let bracketsSignStr = expression.replace(/[^\[]/g, '');
		if (bracketsSignStr.length < 2) {
			printOutput("Syntax error: wrong matrix syntax - wrong '[]' count. Check input")
			return false;
		}
		return true;
	}

	if (checkMatrixSyntax(right)) {
		savedVariables[left] = {};
		savedVariables[left].type = 'matrix';
		savedVariables[left].value = right.substring(1, right.length - 1);
		matrix = savedVariables[left].value.split(';');
		savedVariables[left].rows = matrix.length;
		savedVariables[left].columns = matrix[0].split(',').length;
		if (savedVariables[left].rows === 1 && savedVariables[left].columns === 1) {
			savedVariables[left] = {};
			savedVariables[left].type = 'real';
			savedVariables[left].value = parseFloat(matrix[0].substring(2, matrix[0].length - 2));
			printOutput(savedVariables[left].value);
		} else {
			let matrix = savedVariables[left].value;
			matrix = matrix.split(';');
			matrix.forEach(row => {
				printOutput('[ ' + row.substring(1, row.length - 1).split(',').join(' , ') + ' ]');
			});
		}
	}
}