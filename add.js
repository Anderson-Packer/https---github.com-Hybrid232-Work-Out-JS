const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the first number: ", (a) => {
  rl.question("Enter the second number: ", (b) => {
    const num1 = Number(a);
    const num2 = Number(b);

    const sum = num1 + num2;
    console.log("The sum is:", sum);

    rl.close();
  });
});
