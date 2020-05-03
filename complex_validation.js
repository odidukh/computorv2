module.exports = validate;

function validate(expression) {
    if (expression.includes('%')) {
        printOutput("Complex numbers don't support 'modulo' operator");
        return true;
    }
    if (expression.includes('(')) {
        printOutput("Complex numbers don't support '()' syntax");
        return true;
    }
    return false;
}