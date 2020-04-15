const calculation = require('./complex_calculation');
const validator = require('./complex_validation')

module.exports = save;

function save(varName, expression) {
    if (validator())
        return ;
    let computedExp = calculation(expression);

    savedVariables[varName] = {};
    savedVariables[varName].type = 'complex';
    savedVariables[varName].value = computedExp;
    printOutput(computedExp);
}