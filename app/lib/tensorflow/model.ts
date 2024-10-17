import * as tf from "@tensorflow/tfjs";
import * as Constant from "@/lib/constant";
import { JSONObject } from "../definations";

/**
 * Added two hidden layers with 64 and 128 units, respectively. This gives the model more capacity to learn complex relationships between ingredients and recipes.
 * Each layer uses the relu (Rectified Linear Unit) activation function, which helps the model capture non-linear relationships.
 *
 */
export const createRecipeModel = (
	ingredientNo: number,
	recipeNo: number,
	categoryNo: number
) => {
	// Input for ingredients
	const ingredientInput = tf.input({
		shape: [ingredientNo],
		name: "ingredientInput",
	});
	let x = tf.layers
		.dense({ units: 128, activation: "relu" })
		.apply(ingredientInput);
	x = tf.layers
		.dense({ units: 64, activation: "relu" })
		.apply(x) as tf.SymbolicTensor;

	// Input for categories
	const categoryInput = tf.input({
		shape: [categoryNo],
		name: "categoryInput",
	});
	let y = tf.layers
		.dense({ units: 32, activation: "relu" })
		.apply(categoryInput) as tf.SymbolicTensor;

	// Concatenate the ingredient and category paths
	const combined = tf.layers.concatenate().apply([x, y]);

	// Output layer for recipes
	const recipeOutput = tf.layers
		.dense({ units: recipeNo, activation: "softmax", name: "recipeOutput" })
		.apply(combined) as tf.SymbolicTensor;

	// Output layer for categories
	const categoryOutput = tf.layers
		.dense({
			units: categoryNo,
			activation: "softmax",
			name: "categoryOutput",
		})
		.apply(combined) as tf.SymbolicTensor;

	// Create the model with two inputs and two outputs
	const model = tf.model({
		inputs: [ingredientInput, categoryInput],
		outputs: [recipeOutput, categoryOutput],
	});
	// Compile the model
	model.compile({
		optimizer: "adam",
		loss: {
			recipeOutput: "categoricalCrossentropy",
			categoryOutput: "categoricalCrossentropy",
		},
		metrics: {
			recipeOutput: "accuracy",
			categoryOutput: "accuracy",
		},
	});

	return model;
};

// Define a simple model
export async function trainRecipeModel(
	model: tf.LayersModel,
	recipes: JSONObject[],
	ingredients: string[],
	categories: string[]
) {
	const {
		ingredientVectors,
		categoryVectors,
		recipeTargets,
		categoryTargets,
	} = prepareTrainingData(recipes, ingredients, categories);

	// // Convert input data (ingredient vectors) to 2D tensor
	const ingredientTensor = tf.tensor2d(ingredientVectors, [
		ingredientVectors.length,
		ingredients.length,
	]); // Shape [batchSize, 63]

	const categoryTensor = tf.tensor2d(categoryVectors, [
		categoryVectors.length,
		categories.length,
	]); // Shape [batchSize, 12]

	const ys = {
		recipeTargets: tf.tensor2d(recipeTargets, [
			recipeTargets.length,
			recipes.length,
		]), // Targets for recipes
		categoryTargets: tf.tensor2d(categoryTargets, [
			categoryTargets.length,
			categories.length,
		]), // Targets for categories
	};

	// Train the model
	await model.fit(
		[ingredientTensor, categoryTensor],
		{
			recipeOutput: ys.recipeTargets, // Assuming ys is structured correctly
			categoryOutput: ys.categoryTargets,
		},
		{
			epochs: 100,
			batchSize: 32,
			// shuffle: true,
			validationSplit: 0.2,
			// callbacks: {
			// 	onEpochEnd: (epoch, logs: any) => {
			// 		console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
			// 	},
			// },
		}
	);
}

const prepareTrainingData = (
	recipes: JSONObject[],
	ingredients: string[],
	categories: string[]
) => {
	const ingredientVectors: number[][] = [];
	const categoryVectors: number[][] = [];
	const recipeTargets: number[][] = [];
	const categoryTargets: number[][] = []; // New target for categories

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const ingredientArray = new Array(ingredients.length).fill(0);
		const recipeIngredientStr = recipe.ingredients.join(" ");

		const categoryArray = new Array(categories.length).fill(0);
		const recipeCategoryStr = recipe.categories
			.map((item: JSONObject) => item.name)
			.join(", ")
			.toLowerCase();

		// INPUT - ingredientVectors
		ingredients.forEach((ingredient, index) => {
			if (
				recipeIngredientStr
					.toLowerCase()
					.indexOf(ingredient.toLowerCase()) >= 0
			) {
				ingredientArray[index] = 1;
			}
		});
		ingredientVectors.push(ingredientArray);

		// OUTPUT - Create a corresponding target output for recipes (one-hot encoding)
		const recipeTargetVector = new Array(recipes.length).fill(0);
		recipeTargetVector[recipeIndex] = 1;
		recipeTargets.push(recipeTargetVector);

		// INPUT - categoryVectors
		categories.forEach((categoryName, index) => {
			if (recipeCategoryStr.indexOf(categoryName.toLowerCase()) >= 0) {
				categoryArray[index] = 1;
			}
		});
		categoryVectors.push(categoryArray);

		// Create a corresponding target output for categories
		const categoryTargetVector = new Array(categories.length).fill(0);
		// Assuming categories are defined in your recipe, populate them appropriately
		// For instance, if the recipe has categories in an array `recipe.categories`:
		recipe.categories.forEach((category: JSONObject) => {
			const categoryIndex = categories.indexOf(category.name);
			if (categoryIndex !== undefined) {
				categoryTargetVector[categoryIndex] = 1; // One-hot encoding
			}
		});
		categoryTargets.push(categoryTargetVector);
	});

	return {
		ingredientVectors,
		categoryVectors,
		recipeTargets,
		categoryTargets,
	};
};
