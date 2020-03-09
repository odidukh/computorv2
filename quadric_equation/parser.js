const allowed_signs = ['+', '-', '*', '^', '.'];

function sign_inverse(string) {
	let temp_string = string;
	let shift = 0;
	if (string === "0") {
		temp_string = "0"
	} else {
		for (let i = 0; i < string.length; i++) {
			if (i === 0 && !allowed_signs.includes(string[0])) {
				temp_string = ['-', temp_string].join('');
				shift++;
			} else if (string[i] === '+') {
				temp_string = temp_string.substr(0, i + shift) + '-' + temp_string.substr(i + shift + 1);
			} else if (string[i] === '-') {
				temp_string = temp_string.substr(0, i + shift) + '+' + temp_string.substr(i + shift + 1);

			}
		}
	}
	return (temp_string);
}

function internal_operations(equation) {
	equation = equation.toUpperCase().split('=');
	[...equation[1]].forEach((char, index) => {
		if (char === '-') {
			equation[1][index] = '+'
		}
	});

	equation[1] = sign_inverse(equation[1]);

	equation = equation.map(function (string) {
		let temp_string = string;
		let shift = 0;
		for (let i = 0; i < string.length; i++) {
			if (string[i] === '-') {
				temp_string = [temp_string.slice(0, i + shift), '+', temp_string.slice(i + shift)].join('');
				shift++;
			}
		}
		return (temp_string);
	});

	let elements_arr = [];
	equation.forEach(function (array) {
		let temp_arr = array.split('+');
		temp_arr.forEach(function (elem) {
			if (elem.length) {
				elements_arr.push(elem);
			}
		})
	});

	return elements_arr;
}


function array_to_map(array_of_terms) {
	let map_degree_coefficient = new Map([[0, 0], [1, 0], [2, 0]]);

	array_of_terms.forEach(term => {

		let minus = 1;
		let coefficient = 0;
		let degree = 0;

		if (term[0] === '-') {
			minus = -1;
			term = term.substr(1);
		}

		if (term.includes('*') && term.includes('^')) {
			coefficient = parseFloat(term.split('*')[0]);
			degree = parseInt(term.split('*')[1].split('^')[1]);
		} else if (term.includes('*') && !term.includes('^')) {
			coefficient = parseFloat(term.split('*')[0]);
			degree = 1;
		} else if (!term.includes('*') && term.includes('^') && term[0] === 'X') {
			coefficient = 1;
			degree = parseInt(term.split('^')[1]);
		} else if (!term.includes('*') && !term.includes('^') && term[0] === 'X') {
			coefficient = 1;
			degree = 1;
		} else if (!term.includes('*') && term.includes('^') && term.includes('X')) {
			coefficient = parseFloat(term.split('X')[0]);
			degree = parseInt(term.split('^')[1]);
		} else if (!term.includes('*') && !term.includes('^') && term.includes('X')) {
			coefficient = parseFloat(term.split('X')[0]);
			degree = 1;
		} else {
			coefficient = parseFloat(term);
			degree = 0;
		}

		if (map_degree_coefficient.has(degree)) {
			map_degree_coefficient.set(degree, map_degree_coefficient.get(degree) + coefficient * minus);
		} else {
			map_degree_coefficient.set(degree, coefficient * minus);
		}
	});
	return (map_degree_coefficient);
}

function coefficients_with_power(input_string) {
	let equation = input_string.split(" ").join("");
	let elements_array = internal_operations(equation);
	return array_to_map(elements_array);
}

module.exports = coefficients_with_power;
