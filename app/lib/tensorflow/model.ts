import * as tf from "@tensorflow/tfjs";
import * as Constant from "@/lib/constant";
import { JSONObject } from "../definations";

/**
 * Added two hidden layers with 64 and 128 units, respectively. This gives the model more capacity to learn complex relationships between ingredients and recipes.
 * Each layer uses the relu (Rectified Linear Unit) activation function, which helps the model capture non-linear relationships.
 *
 */

// Define a simple model
export const createRecipeModel = (ingredientNo: number, recipeNo: number) => {
	// Initializes a sequential model. A sequential model is a linear stack of layers where you can easily add new layers one after the other.
	const model = tf.sequential();

	// Input layer with 10 features (instead of 5)
	// This adds a fully connected (dense) layer to the model.
	model.add(
		tf.layers.dense({
			// This specifies the input shape. Here, it indicates that the model expects input vectors of size `ingredientNo`.
			// This corresponds to the number of ingredient features, as each recipe is represented by a vector of `ingredientNo` elements
			// (1 for presence and 0 for absence of each ingredient).
			inputShape: [ingredientNo],
			// This defines the number of neurons (or units) in this layer. In this case, there are 64 neurons.
			units: 64,
			// The ReLU (Rectified Linear Unit) activation function is used, which outputs the input directly
			// if it is positive; otherwise, it will output zero. This helps introduce non-linearity into the model.
			activation: "relu",
		})
	);

	// Hidden layer
	// Another dense layer is added, but this time it does not specify the input shape since it automatically infers it from the previous layer.
	model.add(tf.layers.dense({ units: 32, activation: "relu" }));

	// Final layer of the model. Output layer with 10 possible recipes
	model.add(
		tf.layers.dense({
			// This specifies that the model will output 10 values, corresponding to the 10 possible recipes.
			// Each output represents the likelihood of the input matching each recipe.
			units: recipeNo, // Number of possible recipes
			// The softmax activation function is used here. It converts the raw output scores (logits) into
			// probabilities by exponentiating the outputs and normalizing them. The result is a probability distribution over the 10 recipes, where the values will sum to 1
			activation: "softmax",
		})
	);

	model.compile({
		// The Adam optimizer is used for training the model. Adam is an adaptive learning rate optimization algorithm that is widely used for deep learning
		optimizer: "adam",
		// This loss function is appropriate for multi-class classification problems where each input belongs to one of multiple categories (recipes).
		// It measures the difference between the predicted probability distribution and the true distribution.
		loss: "categoricalCrossentropy",
		// This specifies that during training, the model will also track accuracy as a metric to evaluate its performance
		metrics: ["accuracy"],
	});

	return model;
};

// Train the model on some example data
export async function trainRecipeModel(
	model: tf.Sequential,
	recipes: JSONObject[],
	ingredients: string[]
) {
	const { ingredientVectors, recipeTargets } = prepareTrainingData(
		recipes,
		ingredients
	);
	// 	console.log("ingredientVectors", ingredientVectors);
	// console.log("recipeTargets", recipeTargets);
	// This converts the ingredients array into a 2D tensor (xs) that TensorFlow.js can work with. Each row in the tensor corresponds to a recipe's ingredient vector.
	const xs = tf.tensor2d(ingredientVectors); // Convert input data to a tensor
	// This converts the recipes array into a 2D tensor (ys) that serves as the target output for training. Each row corresponds to the one-hot encoded recipe vector.
	const ys = tf.tensor2d(recipeTargets); // Convert output (target) data to a tensor

	// This method is used to train the model with the provided input (xs) and output (ys) tensors.
	// The training process will adjust the model's weights to minimize the loss function defined during compilation.
	await model.fit(xs, ys, {
		// This indicates that the model will go through the entire dataset 100 times. Each pass through the dataset is called an epoch.
		epochs: 100, // Train for 100 iterations
		// This specifies that during training, the model will use 4 examples at a time to compute the gradients and update the weights.
		// A smaller batch size can lead to more noisy estimates of the gradients, while a larger batch size results in more stable but less frequent updates.
		batchSize: 10, // The number of examples to feed before updating weights
		// This means that the training data will be shuffled at the beginning of each epoch.
		// Shuffling helps prevent the model from learning patterns based solely on the order of the training data.
		shuffle: true, // Shuffle data at each epoch
		// This means that 20% of the training data will be used for validation.
		// The model's performance will be evaluated on this validation set after each epoch, allowing you to monitor overfitting and adjust parameters as necessary.
		// validationSplit: 0.2, // Use 20% of data for validation
	});
}

const prepareTrainingData = (recipes: JSONObject[], ingredients: string[]) => {
	// Prepare input and output tensors
	const ingredientVectors: number[][] = [];
	const recipeTargets: number[][] = [];

	recipes.forEach((recipe: JSONObject, recipeIndex: number) => {
		const ingredientArray = new Array(ingredients.length).fill(0);
		const recipeIngredientStr = recipe.ingredients.join(" ");

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

		//  // Create a corresponding target output for ys
		//  const targetVector = new Array(recipe.ingredientData.length).fill(0);
		//  // Here you can define how you want to set the target based on the recipe.
		//  // For example, using ingredientData as a binary indicator for simplicity.
		//  recipe.ingredientData.forEach((data: any, index: number) => {
		// 	// // Populate targetVector based on your logic for ingredients
		// 	// if (index < recipe.ingredientData.length) {
		// 	// 	targetVector[index] = data; // Use your logic for targets
		// 	// }
		// 	 targetVector[index] = data; // This would be your logic for targets
		//  });
		//  recipeTargets.push(targetVector);

		// Create a corresponding target output for ys
		const targetVector = new Array(recipes.length).fill(0); // This should be initialized to recipes.length (166)
		targetVector[recipeIndex] = 1; // Assuming one-hot encoding for each recipe

		recipeTargets.push(targetVector);
	});

	return { ingredientVectors, recipeTargets };
};
