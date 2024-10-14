import * as tf from "@tensorflow/tfjs";


/**
 * Added two hidden layers with 64 and 128 units, respectively. This gives the model more capacity to learn complex relationships between ingredients and recipes.
 * Each layer uses the relu (Rectified Linear Unit) activation function, which helps the model capture non-linear relationships.
 * 
 */

// Define a simple model
export const createRecipeModel = () => {
	const model = tf.sequential();
  
	// Input layer with 10 features (instead of 5)
	model.add(tf.layers.dense({
	  inputShape: [10], // This should match the number of features in `ingredientData`
	  units: 16, 
	  activation: 'relu',
	}));
  
	// Hidden layer
	model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  
	// Output layer with 10 possible recipes
	model.add(tf.layers.dense({
	  units: 10, // Number of possible recipes
	  activation: 'softmax',
	}));
  
	model.compile({
	  optimizer: 'adam',
	  loss: 'categoricalCrossentropy',
	  metrics: ['accuracy'],
	});
  
	return model;
  };
  

// Train the model on some example data
export async function trainRecipeModel(
	model: tf.Sequential,
	ingredients: number[][],
	recipes: number[][]
) {
	const xs = tf.tensor2d(ingredients); // Convert input data to a tensor
	const ys = tf.tensor2d(recipes); // Convert output (target) data to a tensor
  
	await model.fit(xs, ys, {
	  epochs: 100, // Train for 100 iterations
	  batchSize: 4, // Batch size of 4 (the number of examples to feed before updating weights)
	  shuffle: true, // Shuffle data at each epoch
	  validationSplit: 0.2, // Use 20% of data for validation
	});
}
