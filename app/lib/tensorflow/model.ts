import * as tf from "@tensorflow/tfjs";
import { JSONObject } from "../definations";

/**
 * Added two hidden layers with 64 and 128 units, respectively. This gives the model more capacity to learn complex relationships between ingredients and recipes.
 * Each layer uses the relu (Rectified Linear Unit) activation function, which helps the model capture non-linear relationships.
 *
 */
export const createRecipeModel = (
	ingredientNo: number,
	recipeNo: number,
	categoryNo: number,
	mealTypeNo: number,
	dietaryRestrictionsNo: number
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
		.dense({ units: 128, activation: "relu" })
		.apply(categoryInput) as tf.SymbolicTensor;
	y = tf.layers
		.dense({ units: 64, activation: "relu" })
		.apply(y) as tf.SymbolicTensor;

	// Input for meal types
	const mealTypeInput = tf.input({
		shape: [mealTypeNo],
		name: "mealTypeInput",
	});
	let z = tf.layers
		.dense({ units: 64, activation: "relu" })
		.apply(mealTypeInput);
	z = tf.layers
		.dense({ units: 32, activation: "relu" })
		.apply(z) as tf.SymbolicTensor;

	// let z = tf.layers
	// 	.dense({ units: 32, activation: "relu" })
	// 	.apply(mealTypeInput) as tf.SymbolicTensor;

	// Input for dietary restrictions
	const dietaryRestrictionInput = tf.input({
		shape: [dietaryRestrictionsNo],
		name: "dietaryRestrictionsInput",
	});

	let w = tf.layers
		.dense({ units: 64, activation: "relu" })
		.apply(dietaryRestrictionInput);
	w = tf.layers
		.dense({ units: 32, activation: "relu" })
		.apply(w) as tf.SymbolicTensor;
		
	// let w = tf.layers
	// 	.dense({ units: 32, activation: "relu" })
	// 	.apply(dietaryRestrictionsInput) as tf.SymbolicTensor;

	// Concatenate the paths for ingredients, categories, meal types, and dietary restrictions
	const combined = tf.layers.concatenate().apply([x, y, z, w]);

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

		
	// Output layer for categories
	const mealTypeOutput = tf.layers
		.dense({ units: mealTypeNo, activation: "softmax", name: "mealTypeOutput" })
		.apply(combined) as tf.SymbolicTensor;

	
	// Output layer for categories
	const dietaryRestrictionOutput = tf.layers
		.dense({ units: dietaryRestrictionsNo, activation: "softmax", name: "dietaryRestrictionOutput" })
		.apply(combined) as tf.SymbolicTensor;

	// Create the model with four inputs and two outputs
	const model = tf.model({
		inputs: [ingredientInput, categoryInput, mealTypeInput, dietaryRestrictionInput ],
		// outputs: recipeOutput
		outputs: [recipeOutput, categoryOutput, mealTypeOutput, dietaryRestrictionOutput],
	});

	// Compile the model
	const optimizer = tf.train.adam(0.001); // Adjust learning rate as needed
	model.compile({
		optimizer: optimizer,
		loss: {
			recipeOutput: "categoricalCrossentropy",
			categoryOutput: "categoricalCrossentropy",
			mealTypeOutput: "categoricalCrossentropy",
			dietaryRestrictionOutput: "categoricalCrossentropy",
		},
		metrics: {
			recipeOutput: "accuracy",
			categoryOutput: "accuracy",
			mealTypeOutput: "accuracy",
			dietaryRestrictionOutput: "accuracy",
		}
	});

	return model;
};

// Define a simple model
export async function trainRecipeModel(
	model: tf.LayersModel,
	recipes: JSONObject[],
	ingredients: string[],
	categories: string[],
	mealTypes: string[],
	dietaryRestrictions: string[]
) {
	const {
		ingredientVectors,
		categoryVectors,
		recipeTargets,
		categoryTargets,
		mealTypeVectors,
		mealTypeTargets,
		dietaryRestrictionVectors,
		dietaryRestrictionTargets
	} = prepareTrainingData(recipes, ingredients, categories, mealTypes, dietaryRestrictions);

	// // Convert input data (ingredient vectors) to 2D tensor
	const ingredientTensor = tf.tensor2d(ingredientVectors, [
		ingredientVectors.length,
		ingredients.length,
	]); // Shape [batchSize, 63]
	const categoryTensor = tf.tensor2d(categoryVectors, [
		categoryVectors.length,
		categories.length,
	]); // Shape [batchSize, 11]
	const mealTypeTensor = tf.tensor2d(mealTypeVectors, [
		mealTypeVectors.length,
		mealTypes.length,
	]); // Shape [batchSize, 4]
	const dietaryRestrictionTensor = tf.tensor2d(dietaryRestrictionVectors, [
		dietaryRestrictionVectors.length,
		dietaryRestrictions.length,
	]); // Shape [batchSize, 5]


	const ys = {
		recipeOutput: tf.tensor2d(recipeTargets, [
			recipeTargets.length,
			recipes.length,
		]), // Targets for recipes
		categoryOutput: tf.tensor2d(categoryTargets, [
			categoryTargets.length,
			categories.length,
		]), // Targets for categories
		mealTypeOutput: tf.tensor2d(mealTypeTargets, [
			mealTypeTargets.length,
			mealTypes.length,
		]),
		dietaryRestrictionOutput: tf.tensor2d(dietaryRestrictionTargets, [
			dietaryRestrictionTargets.length,
			dietaryRestrictions.length,
		]),
	};

	// Train the model
	await model.fit(
		[ingredientTensor, categoryTensor, mealTypeTensor, dietaryRestrictionTensor],
		ys,
		{
			epochs: 1000, // Total epochs, but training may stop earlier
			batchSize: 32, // Number of samples per gradient update
			shuffle: true, // Shuffle training data before each epoch
			validationSplit: 0.2, // Use 20% of the data for validation
			callbacks: [earlyStopping], // Apply early stopping
			// callbacks: {
			// 	onEpochEnd: (epoch, logs: any) => {
			// 		console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
			// 	},
			// },
		}
	);
	
	// // Train the model
	// await model.fit(
	// 	[ingredientTensor, categoryTensor, mealTypeTensor, dietaryRestrictionTensor],
	// 	{
	// 		recipeOutput: ys.recipeTargets, // Assuming ys is structured correctly
	// 		categoryOutput: ys.categoryTargets,
	// 		mealTypeOutput: ys.mealTypeTargets,
	// 		dietaryRestrictionOutput: ys.dietaryRestrictionTargets
	// 	},
	// 	{
	// 		epochs: 1000, // Total epochs, but training may stop earlier
	// 		batchSize: 32, // Number of samples per gradient update
	// 		shuffle: true, // Shuffle training data before each epoch
	// 		validationSplit: 0.2, // Use 20% of the data for validation
	// 		callbacks: [earlyStopping], // Apply early stopping
	// 		// callbacks: {
	// 		// 	onEpochEnd: (epoch, logs: any) => {
	// 		// 		console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
	// 		// 	},
	// 		// },
	// 	}
	// );
}

const earlyStopping = tf.callbacks.earlyStopping({
	monitor: "val_loss", // You can monitor 'val_loss' or 'val_accuracy'
	patience: 5, // Number of epochs to wait after no improvement
	verbose: 1,
	// restoreBestWeights: true // Restore the model weights from the epoch with the best value of the monitored quantity
});

const prepareTrainingData = (
	recipes: JSONObject[],
	ingredients: string[],
	categories: string[],
	mealTypes: string[],
	dietaryRestrictions: string[]
) => {
	const ingredientVectors: number[][] = prepareTrainingData_IngredientVectors(ingredients, recipes);
	const recipeTargets: number[][] = prepareTrainingData_RecipesTarget(recipes);
	const { categoryVectors, categoryTargets } = prepareTrainingData_Categories(categories, recipes);
	const { mealTypeVectors, mealTypeTargets } = prepareTrainingData_MealTypes(mealTypes, recipes);
	const { dietaryRestrictionVectors, dietaryRestrictionTargets } = prepareTrainingData_DietaryRestrictions(dietaryRestrictions, recipes);

	return {
		ingredientVectors,
		categoryVectors,
		recipeTargets,
		categoryTargets,
		mealTypeVectors,
		mealTypeTargets,
		dietaryRestrictionVectors,
		dietaryRestrictionTargets
	};
};

const prepareTrainingData_IngredientVectors = (ingredients: string[], recipes: JSONObject[]): number[][] => {
	const ingredientVectors: number[][] = [];

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const ingredientArray = new Array(ingredients.length).fill(0);
		const recipeIngredientStr = recipe.ingredients.join(" ");

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
	});

	return ingredientVectors;
}

const prepareTrainingData_RecipesTarget = (recipes: JSONObject[]): number[][] => {

	const recipeTargets: number[][] = [];

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const recipeTargetVector = new Array(recipes.length).fill(0);
		recipeTargetVector[recipeIndex] = 1;
		recipeTargets.push(recipeTargetVector);
	});

	return recipeTargets;
}

const prepareTrainingData_Categories = (categories: string[], recipes: JSONObject[]): JSONObject => {

	const categoryVectors: number[][] = [];
	const categoryTargets: number[][] = [];

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const categoryArray = new Array(categories.length).fill(0);
		const recipeCategoryStr = recipe.categories
			.map((item: JSONObject) => item.name)
			.join(", ")
			.toLowerCase();

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

	return { categoryVectors, categoryTargets };
}

const prepareTrainingData_MealTypes = (mealTypes: string[], recipes: JSONObject[]): JSONObject => {

	const mealTypeVectors: number[][] = [];
	const mealTypeTargets: number[][] = [];

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const mealTypeArray = new Array(mealTypes.length).fill(0);
		const recipeMealTypeStr = recipe.mealTypes.map((type: string) => type).join(", ").toLowerCase();

		// INPUT - mealTypeVectors
		mealTypes.forEach((categoryName, index) => {
			if (recipeMealTypeStr.indexOf(categoryName.toLowerCase()) >= 0) {
				mealTypeArray[index] = 1;
			}
		});
		mealTypeVectors.push(mealTypeArray);

		// Create a corresponding target output for categories
		const categoryTargetVector = new Array(mealTypes.length).fill(0);
		// Assuming categories are defined in your recipe, populate them appropriately
		// For instance, if the recipe has categories in an array `recipe.categories`:
		recipe.mealTypes.forEach((type: string) => {
			const mealTypeIndex = mealTypes.indexOf(type);
			if (mealTypeIndex !== undefined) {
				categoryTargetVector[mealTypeIndex] = 1; // One-hot encoding
			}
		});
		mealTypeTargets.push(categoryTargetVector);
	});

	return { mealTypeVectors, mealTypeTargets };
}


const prepareTrainingData_DietaryRestrictions = (dietaryRestrictions: string[], recipes: JSONObject[]): JSONObject => {

	const dietaryRestrictionVectors: number[][] = [];
	const dietaryRestrictionTargets: number[][] = [];

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const dietaryRestrictionArray = new Array(dietaryRestrictions.length).fill(0);
		const recipeDietaryRestrictionStr = recipe.dietaryRestrictions.map((type: string) => type).join(", ").toLowerCase();

		// INPUT - dietaryRestrictionVectors
		dietaryRestrictions.forEach((restrictionName, index) => {
			if (recipeDietaryRestrictionStr.indexOf(restrictionName.toLowerCase()) >= 0) {
				dietaryRestrictionArray[index] = 1;
			}
		});
		dietaryRestrictionVectors.push(dietaryRestrictionArray);

		// Create a corresponding target output for categories
		const categoryTargetVector = new Array(dietaryRestrictions.length).fill(0);
		// Assuming categories are defined in your recipe, populate them appropriately
		// For instance, if the recipe has categories in an array `recipe.categories`:
		recipe.dietaryRestrictions.forEach((type: string) => {
			const dietaryRestrictionIndex = dietaryRestrictions.indexOf(type);
			if (dietaryRestrictionIndex !== undefined) {
				categoryTargetVector[dietaryRestrictionIndex] = 1; // One-hot encoding
			}
		});
		dietaryRestrictionTargets.push(categoryTargetVector);
	});

	return { dietaryRestrictionVectors, dietaryRestrictionTargets };
}