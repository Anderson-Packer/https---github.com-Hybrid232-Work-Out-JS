// fitnessCalculatorCLI.js

const readline = require('readline');

/**
 * Fitness Calculator
 * 
 * Calculates daily calories and macronutrients based on user input.
 * Inputs: age, height (inches), weight (lbs), gender, activity level (hours/week)
 * Outputs: calories, protein, carbs, fats
 */

// --- Core Calculation Function ---
function calculateFitness({ age, heightInches, weightLbs, gender, activityHours }) {
  // --- Assumptions ---
  // 1. Height and weight inputs are in imperial units: inches and pounds.
  // 2. Internal calculation converts height to cm and weight to kg:
  //      height (cm) = heightInches * 2.54
  //      weight (kg) = weightLbs * 0.453592
  // 3. Basal Metabolic Rate (BMR) uses Mifflin-St Jeor Equation:
  //      Men:    BMR = 10*weight + 6.25*height - 5*age + 5
  //      Women:  BMR = 10*weight + 6.25*height - 5*age - 161
  // 4. Activity factor based on weekly hours of exercise:
  //      0–2 hrs → sedentary (1.2)
  //      3–5 hrs → light (1.375)
  //      6–8 hrs → moderate (1.55)
  //      9–11 hrs → active (1.725)
  //      12+ hrs → very active (1.9)
  // 5. Total Daily Energy Expenditure (TDEE) = BMR * activity factor
  // 6. Macronutrient distribution:
  //      Protein: 1.6 g per kg of body weight
  //      Fat: 30% of total calories
  //      Carbs: remaining calories
  // 7. Calorie conversion:
  //      Protein: 4 kcal/g
  //      Carbs: 4 kcal/g
  //      Fat: 9 kcal/g

  // Convert inputs to metric
  const height = heightInches * 2.54; // inches → cm
  const weight = weightLbs * 0.453592; // lbs → kg

  // Calculate BMR
  let bmr;
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Determine activity factor
  let activityFactor;
  if (activityHours <= 2) activityFactor = 1.2;
  else if (activityHours <= 5) activityFactor = 1.375;
  else if (activityHours <= 8) activityFactor = 1.55;
  else if (activityHours <= 11) activityFactor = 1.725;
  else activityFactor = 1.9;

  // Total daily calories
  const calories = Math.round(bmr * activityFactor);

  // Macronutrient calculations
  const protein = Math.round(weight * 1.6); // grams
  const proteinCalories = protein * 4;

  const fatCalories = calories * 0.3; // 30% of calories from fat
  const fat = Math.round(fatCalories / 9); // grams

  const carbCalories = calories - (proteinCalories + fatCalories);
  const carbs = Math.round(carbCalories / 4); // grams

  return { calories, protein, carbs, fats: fat };
}

// --- Terminal Input Setup ---
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

// --- Main Program ---
async function main() {
  console.log("Welcome to the Fitness Calculator!\n");

  const age = parseInt(await ask("Enter your age (years): "));
  const heightInches = parseFloat(await ask("Enter your height (inches): "));
  const weightLbs = parseFloat(await ask("Enter your weight (lbs): "));
  const gender = await ask("Enter your gender (male/female): ");
  const activityHours = parseFloat(await ask("Enter activity hours per week: "));

  const result = calculateFitness({ age, heightInches, weightLbs, gender, activityHours });

  console.log("\nYour daily recommended intake:");
  console.log(`Calories: ${result.calories} kcal`);
  console.log(`Protein: ${result.protein} g`);
  console.log(`Carbs: ${result.carbs} g`);
  console.log(`Fats: ${result.fats} g`);

  rl.close();
}

// Run the CLI program
main();
