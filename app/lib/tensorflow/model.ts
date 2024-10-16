import * as tf from "@tensorflow/tfjs";
import * as Constant from "@/lib/constant";
import { JSONObject } from "../definations";

/**
 * Added two hidden layers with 64 and 128 units, respectively. This gives the model more capacity to learn complex relationships between ingredients and recipes.
 * Each layer uses the relu (Rectified Linear Unit) activation function, which helps the model capture non-linear relationships.
 *
 */

export const createRecipeModel = (ingredientNo: number, recipeNo: number, categoryNo: number) => {
    // Input layer
    const input = tf.input({ shape: [ingredientNo] });

    // Hidden layers
    const hidden = tf.layers.dense({ units: 128, activation: 'relu' }).apply(input);
    const hidden2 = tf.layers.dense({ units: 64, activation: 'relu' }).apply(hidden);

    // Output layer for recipes
    const recipeOutput = tf.layers.dense({ units: recipeNo, activation: 'softmax', name: 'recipeOutput' }).apply(hidden2) as tf.SymbolicTensor;

    // Output layer for categories
    const categoryOutput = tf.layers.dense({ units: categoryNo, activation: 'softmax', name: 'categoryOutput' }).apply(hidden2) as tf.SymbolicTensor;

    // Create the model with both outputs
    const model = tf.model({
        inputs: input,
        outputs: [recipeOutput, categoryOutput] // Outputs as an array of SymbolicTensor
    });

    // Compile the model
    model.compile({
        optimizer: 'adam',
        loss: {
            recipeOutput: 'categoricalCrossentropy', // Loss for recipe output
            categoryOutput: 'categoricalCrossentropy', // Loss for category output
        },
        metrics: {
            recipeOutput: 'accuracy', // Metrics for recipe output
            categoryOutput:'accuracy', // Metrics for category output
        }
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
	const { ingredientVectors, recipeTargets, categoryTargets } = prepareTrainingData(
		recipes,
		ingredients,
        categories
	);

	// // Convert input data (ingredient vectors) to 2D tensor
	// const xs = tf.tensor2d(ingredientVectors, [ingredientVectors.length, ingredients.length]);

	// // Convert target data (one-hot encoded recipe targets) to 2D tensor
	// const ys = tf.tensor2d(recipeTargets, [recipeTargets.length, recipes.length]);

	const xs = tf.tensor2d(ingredientVectors); // Features
	const ys = {
		recipeTargets: tf.tensor2d(recipeTargets), // Targets for recipes
		categoryTargets: tf.tensor2d(categoryTargets) // Targets for categories
	};
	// // Example for preparing labels
	// const recipeLabels = recipes.map( item => item.name);
	// const ys = {
	// 	recipeOutput: tf.tensor2d(recipeLabels, [recipeLabels.length, recipeLabels.length]),
	// 	categoryOutput: tf.tensor2d(categories, [categories.length, categories.length])
	// };

	// // Ensure input and output shapes match
	// console.log(`Input shape: ${xs.shape}`);
	// console.log(`Target shape: ${ys.shape}`);

	// Train the model
	await model.fit(xs, { 
		recipeOutput: ys.recipeTargets, // Assuming ys is structured correctly
		categoryOutput: ys.categoryTargets 
	}, {
		epochs: 100,
		batchSize: 32,
		// shuffle: true,
		validationSplit: 0.2,
		// callbacks: {
		// 	onEpochEnd: (epoch, logs: any) => {
		// 		console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
		// 	},
		// },
	});
}

const prepareTrainingData = (recipes: JSONObject[], ingredients: string[], categories: string[]) => {
    const ingredientVectors: number[][] = [];
    const recipeTargets: number[][] = [];
    const categoryTargets: number[][] = []; // New target for categories

    recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
        const ingredientArray = new Array(ingredients.length).fill(0);
        const recipeIngredientStr = recipe.ingredients.join(" ");

        ingredients.forEach((ingredient, index) => {
            if (recipeIngredientStr.toLowerCase().indexOf(ingredient.toLowerCase()) >= 0) {
                ingredientArray[index] = 1;
            }
        });
        ingredientVectors.push(ingredientArray);

        // Create a corresponding target output for recipes (one-hot encoding)
        const recipeTargetVector = new Array(recipes.length).fill(0);
        recipeTargetVector[recipeIndex] = 1;
        recipeTargets.push(recipeTargetVector);

        // Create a corresponding target output for categories
        const categoryTargetVector = new Array(categories.length).fill(0);
        // Assuming categories are defined in your recipe, populate them appropriately
        // For instance, if the recipe has categories in an array `recipe.categories`:
        recipe.categories.forEach((category: string) => {
            // const categoryIndex = getCategoryIndex(category); // Implement this function
			const categoryIndex = categories.indexOf(category);
            if (categoryIndex !== undefined) {
                categoryTargetVector[categoryIndex] = 1; // One-hot encoding
            }
        });
        categoryTargets.push(categoryTargetVector);
    });

    return { ingredientVectors, recipeTargets, categoryTargets };
};
