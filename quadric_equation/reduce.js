let signs_with_spaces = ['+', '-', '*', '='];

function natural_reduced_form(map, variable) {
	let reduced_equation = '';

	map.forEach((value, key) => {
		if (key === 0) {
			if (value > 0) {
				if (reduced_equation.length === 0) {
					reduced_equation = value.toString();
				} else {
					reduced_equation = reduced_equation + '+' + value.toString();
				}
			} else if (value < 0) {
				reduced_equation = reduced_equation + value.toString();
			}
		} else if (key === 1) {
			if (value > 0) {
				if (reduced_equation.length === 0) {
					reduced_equation = value.toString() + '*' + variable;
				} else {
					reduced_equation = reduced_equation + '+' + value.toString() + '*' + variable;
				}
			} else if (value < 0) {
				reduced_equation = reduced_equation + value.toString() + '*' + variable;
			}
		} else {
			if (value === 1) {
				if (reduced_equation.length === 0) {
					reduced_equation = variable + '^' + key.toString();
				} else {
					reduced_equation = reduced_equation + '+' + variable + '^' + key.toString();
				}
			} else if (value === -1) {
				if (reduced_equation.length === 0) {
					reduced_equation = '-' + variable + '^' + key.toString();
				} else {
					reduced_equation = reduced_equation + '-' + variable + '^' + key.toString();
				}
			} else if (value > 0) {
				if (reduced_equation.length === 0) {
					reduced_equation = value.toString() + '*' + variable + '^' + key.toString();
				} else {
					reduced_equation = reduced_equation + '+' + value.toString() + '*' + variable + '^' + key.toString();
				}
			} else if (value < 0) {
				reduced_equation = reduced_equation + value.toString() + '*' + variable + '^' + key.toString();
			}
		}
	});

	if (reduced_equation.length === 0) {
		return;
	}

	reduced_equation = reduced_equation + '=0';

	return (reduced_equation.replace(new RegExp('\\' + signs_with_spaces.join('|\\'), 'g'), ' $& '));
}

function usual_reduced_form(map, variable) {
	let reduced_equation = '';
	map.forEach((value, key) => {
		if (value > 0) {
			if (reduced_equation.length === 0) {
				reduced_equation = value.toString() + '*' + variable + '^' + key.toString();
			} else {
				reduced_equation = reduced_equation + '+' + value.toString() + '*' + variable + '^' + key.toString();
			}
		} else if (value < 0) {
			reduced_equation = reduced_equation + value.toString() + '*' + variable + '^' + key.toString();
		}
	});

	if (reduced_equation.length === 0) {
		return;
	}
	reduced_equation = reduced_equation + '=0';

	return (reduced_equation.replace(new RegExp('\\' + signs_with_spaces.join('|\\'), 'g'), ' $& '));
}

function reduce(map, initial_equation, variable) {
	if (initial_equation.includes(variable + "^1") || initial_equation.includes(variable + "^0")) {
		return usual_reduced_form(map, variable);
	} else {
		return natural_reduced_form(map, variable);
	}
}

module.exports = reduce;