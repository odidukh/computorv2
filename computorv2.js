const globals = require('./globals');
const isInputValid = require('./validation');
const handler = require('./handler');

let stdin = process.openStdin();


function processInput(input) {
	if (keyWords.includes(input))
		processKeyWords(input);
	else if (isInputValid(input)) {
		input = input.split(' ').join('');
		handler(input);
	}
}


stdin.addListener('data', input => {
	input = input.toString().trim();

	saveToHistory('{input} : "' + input + '"');

	processInput(input);
});