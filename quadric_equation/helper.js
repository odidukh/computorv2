function abs(number) {
    if (number < 0)
        return (-number);
    else
        return (number);
}

function sqrt(number) {
    let epsilon = 0.000001;
    let result = number / 2;

    while (abs(result * result - number) > epsilon) {
        let temp_num = number / result;
        result = (result + temp_num) / 2;
    }

    return (result);
}

module.exports = sqrt;