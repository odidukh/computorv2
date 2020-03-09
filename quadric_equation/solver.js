const sqrt = module.require("./helper.js");

function linear_equation_solver(b, c) {
    printOutput("This is the linear equation. Its only solution is :");
    printOutput((- c / b).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1'));
}

function equation_solver_without_b_and_c() {
    printOutput("This is the incomplete quadratic equation. Its only solution is :");
    printOutput("0");
}

function equation_solver_without_a_and_c() {
    printOutput("This is the linear equation. Its only solution is :");
    printOutput("0");
}

function quadratic_equation_solver (a, b, c) {
    let Discriminant;

    Discriminant = b * b - 4 * a * c;

    if (Discriminant > 0) {
        let solution_2 = ((-b - sqrt(Discriminant)) / (2 * a)).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');
        let solution_1 = ((-b + sqrt(Discriminant)) / (2 * a)).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');

        if (solution_1 === "-0" || solution_1 === "0") {
            solution_1 = "0";
        }
        if (solution_2 === "-0" || solution_2 === "0") {
            solution_2 = "0";
        }

        printOutput("Discriminant is strictly positive, the two solutions are:");
        printOutput(solution_1);
        printOutput(solution_2);
    }
    if (Discriminant === 0) {
        let solution = (- b / (2 * a)).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');
        if (solution === "-0" || solution === "0") {
            solution = "0";
        }
        printOutput("The solution is:");
        printOutput(solution);
    }
    if (Discriminant < 0) {
        if (b === 0) {
            printOutput("Discriminant is less then 0. Solution is a complex number:");
            printOutput(sqrt(-Discriminant).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1') + 'i')
        } else {
            let Real_part = (-b / (2 * a)).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');
            let Imaginary_part = (sqrt(-Discriminant) / (2 * a)).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');
            if (Imaginary_part < 0) {
                Imaginary_part = (Imaginary_part * -1).toFixed(6).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');
            }
            printOutput("Discriminant is less then 0. Solutions are complex numbers:");
            printOutput(Real_part + " + " + Imaginary_part + "i");
            printOutput(Real_part + " - " + Imaginary_part + "i");
        }
    }

};

function solver_selector(a, b, c) {
    if (a === 0 && b === 0 && c === 0) {
        printOutput("This equation is an identity, so all real numbers are solutions.")
    } else if (a === 0 && b === 0 && c !== 0) {
        printOutput("This equation is mathematically wrong. It has no solutions.")
    } else if (a !== 0 && b === 0 && c === 0) {
        equation_solver_without_b_and_c();
    } else if (a === 0 && b !== 0 && c !== 0) {
        linear_equation_solver(b, c);
    } else if (a === 0 && b !== 0 && c === 0) {
        equation_solver_without_a_and_c();
    } else {
        quadratic_equation_solver(a, b, c)
    }
}

module.exports = solver_selector;
