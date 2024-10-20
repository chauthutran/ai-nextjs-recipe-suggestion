import * as tf from '@tensorflow/tfjs';
import { JSONObject } from '../definations';
import * as Constant from "@/lib/constant";


export const preditRecipes = async(inputText: string, ingredients: string[], categories: JSONObject[], recipes: JSONObject[], model: tf.LayersModel): Promise<JSONObject[]> => {
	const categoryNames = categories!.map((item) => item.name);

	const ingredientArray = convertIngredientToFeatures(inputText, ingredients!);
	const categoryArray = convertCategoryToFeatures(inputText, categoryNames);
	const mealTypeArray = convertMealTypeToFeatures(inputText, Constant.MEAL_TYPES);
	const dietaryRestrictionArray = convertDietaryRestrictionToFeatures( inputText, Constant.DIETARY_RESTRICTIONS);

	// Create tensors
	const ingredientTensor = tf.tensor2d(
		[ingredientArray],
		[1, ingredients!.length]
	);
	const categoryTensor = tf.tensor2d(
		[categoryArray],
		[1, categories!.length]
	);
	const mealTypeTensor = tf.tensor2d(
		[mealTypeArray],
		[1, Constant.MEAL_TYPES.length]
	);
	const dietaryRestrictionTensor = tf.tensor2d(
		[dietaryRestrictionArray],
		[1, Constant.DIETARY_RESTRICTIONS.length]
	);

	// Perform the prediction
	const predictions = model.predict([
		ingredientTensor,
		categoryTensor,
		mealTypeTensor,
		dietaryRestrictionTensor,
	]) as tf.Tensor[];
	// Get the recipe output tensor
	const recipeOutput = predictions[0]; // Recipe predictions
	const categoryOutput = predictions[1]; // Category predictions
	const mealTypeOutput = predictions[2]; // Mealtype predictions
	const dietaryRestrictionOutput = predictions[3]; // dietaryRestriction predictions

	// Convert predictions to array
	const recipePredictions = await recipeOutput.data();
	const categoryPredictions = await categoryOutput.data();
	const mealTypePredictions = await mealTypeOutput.data();
	const dietaryRestrictionPredictions = await dietaryRestrictionOutput.data();

	const predictedRecipes = getTopPredictions(
		Array.from(recipePredictions),
		10,
		recipes!
	);
	const predictedCategories = getTopPredictions(
		Array.from(categoryPredictions),
		3,
		categoryNames!
	);
	const predictedMealTypes: string[] = getTopPredictions(
		Array.from(mealTypePredictions),
		3,
		Constant.MEAL_TYPES
	);
	const preditedDietaryRestrictions = getTopPredictions(
		Array.from(dietaryRestrictionPredictions),
		1,
		Constant.DIETARY_RESTRICTIONS
	);

    const filterRecipes = predictedRecipes.filter((recipe: JSONObject) => 
        recipe.categories.filter((item: JSONObject) => predictedCategories.includes(item.name)).length > 0
        // && recipe.mealTypes.filter((item: string) => predictedMealTypes.includes(item)).length > 0
        && recipe.dietaryRestrictions.filter((item: string) => preditedDietaryRestrictions.includes(item)).length > 0
    );

    return filterRecipes;
};


export const preditMealPlan = async(inputPreferences: JSONObject, ingredients: string[],categories: JSONObject[], recipes: JSONObject[], model: tf.LayersModel): Promise<JSONObject[]> => {
    
	const categoryNames = categories!.map((item) => item.name);

	 // Create tensors
     const ingredientArray = new Array(ingredients!.length).fill(0);
     const categoryArray = new Array(categories!.length).fill(0);
     const mealTypeArray = convertMealTypeToFeatures(inputPreferences.mealType, Constant.MEAL_TYPES);
     const dietaryRestrictionArray = convertMealTypeToFeatures(inputPreferences.mealType, Constant.DIETARY_RESTRICTIONS);

	// Create tensors
	const ingredientTensor = tf.tensor2d(
		[ingredientArray],
		[1, ingredients!.length]
	);
	const categoryTensor = tf.tensor2d(
		[categoryArray],
		[1, categories!.length]
	);
	const mealTypeTensor = tf.tensor2d(
		[mealTypeArray],
		[1, Constant.MEAL_TYPES.length]
	);
	const dietaryRestrictionTensor = tf.tensor2d(
		[dietaryRestrictionArray],
		[1, Constant.DIETARY_RESTRICTIONS.length]
	);

	// Perform the prediction
	const predictions = model.predict([
		ingredientTensor,
		categoryTensor,
		mealTypeTensor,
		dietaryRestrictionTensor,
	]) as tf.Tensor[];
	// Get the recipe output tensor
	const recipeOutput = predictions[0]; // Recipe predictions
	const categoryOutput = predictions[1]; // Category predictions
	const mealTypeOutput = predictions[2]; // Mealtype predictions
	const dietaryRestrictionOutput = predictions[3]; // dietaryRestriction predictions

	// Convert predictions to array
	const recipePredictions = await recipeOutput.data();
	const categoryPredictions = await categoryOutput.data();
	const mealTypePredictions = await mealTypeOutput.data();
	const dietaryRestrictionPredictions = await dietaryRestrictionOutput.data();

	const predictedRecipes = getTopPredictions(
		Array.from(recipePredictions),
		10,
		recipes!
	);
	const predictedCategories = getTopPredictions(
		Array.from(categoryPredictions),
		3,
		categoryNames!
	);
	const predictedMealTypes: string[] = getTopPredictions(
		Array.from(mealTypePredictions),
		1,
		Constant.MEAL_TYPES
	);
	const preditedDietaryRestrictions = getTopPredictions(
		Array.from(dietaryRestrictionPredictions),
		1,
		Constant.DIETARY_RESTRICTIONS
	);
console.log("==== predictedRecipes:", predictedRecipes);
console.log("predictedCategories:", predictedCategories);
console.log("predictedMealTypes:", predictedMealTypes);
console.log("preditedDietaryRestrictions:", preditedDietaryRestrictions);
    const filterRecipes = predictedRecipes.filter((recipe: JSONObject) => 
        recipe.categories.filter((item: JSONObject) => predictedCategories.includes(item.name)).length > 0
        && recipe.mealTypes.filter((item: string) => predictedMealTypes.includes(item)).length > 0
        && recipe.dietaryRestrictions.filter((item: string) => preditedDietaryRestrictions.includes(item)).length > 0
    );

    return filterRecipes;
};

export const parseIngredients = (ingredients: string[], text: string) => {
	// Basic keyword-based parsing (expand this list as needed)

	// Initialize an array of 10 ingredients (all 0 by default)
	const ingredientArray = Array(ingredients!.length).fill(0);

	// Check if the text contains any known ingredient and mark it as "1" in the array
	ingredients!.forEach((ingredient: string, index: number) => {
		if (text.toLowerCase().includes(ingredient.toLowerCase())) {
			ingredientArray[index] = 1;
		}
	});

	return ingredientArray;
};

export const convertIngredientToFeatures = (
	inputText: string,
	ingredients: string[]
): number[] => {
	// Step 1: Normalize text to lowercase
	const normalizedText = inputText.toLowerCase();

	// Step 3: Generate one-hot vector for ingredients
	const ingredientVector = ingredients!.map((ingredient) =>
		normalizedText.includes(ingredient.toLowerCase()) ? 1 : 0
	);

	// Step 5: Return ingredient and category vectors
	return ingredientVector;
};

export const convertCategoryToFeatures = (
	inputText: string,
	categories: string[]
): number[] => {
	// Step 1: Normalize text to lowercase
	const normalizedText = inputText.toLowerCase();

	// Step 4: Generate one-hot vector for categories
	const categoryVector = categories!.map((categoryName) =>
		normalizedText.includes(categoryName.toLowerCase()) ? 1 : 0
	);

	// Step 5: Return ingredient and category vectors
	return categoryVector;
};

export const convertMealTypeToFeatures = (
	inputText: string,
	mealTypes: string[]
): number[] => {
	// Step 1: Normalize text to lowercase
	const normalizedText = inputText.toLowerCase();

	const mealTypeVector = mealTypes!.map((mealType) =>
		normalizedText.includes(mealType.toLowerCase()) ? 1 : 0
	);

	// Step 5: Return ingredient and category vectors
	return mealTypeVector;
};

export const convertDietaryRestrictionToFeatures = (
	inputText: string,
	dietaryRestrictions: string[]
): number[] => {
	// Step 1: Normalize text to lowercase
	const normalizedText = inputText.toLowerCase();

	const dietaryRestrictionVector = dietaryRestrictions!.map((restriction) =>
		normalizedText.includes(restriction.toLowerCase()) ? 1 : 0
	);

	// Step 5: Return ingredient and category vectors
	return dietaryRestrictionVector;
};

export const getTopPredictions = <T extends JSONObject | string>(
	predictions: number[],
	numberOfResults: number,
	list: T[]
): T[] => {
	// return predictions
	//   .map((probability, index) => ({ index, probability }))
	//   .sort((a, b) => b.probability - a.probability)
	//   .slice(0, numberOfResults);

	const preditedIndexes = Array.from(predictions)
		.map((pred, index) => ({ index, pred }))
		.sort((a, b) => b.pred - a.pred) // Sort in descending order
		.slice(0, numberOfResults); // Get top 10

	return preditedIndexes.map((item) => list[item.index]) as T[]; // Assumi
};

// export const getTopPredictionIndexes = async (predictions: tf.Tensor, numberOfResults: number): Promise<number[]> => {
//     // Convert predictions tensor to an array
//     const predictionArray = await predictions.array() as number[][];

//     // Flatten the array to include top predictions for all inputs
//     const topRecipeIndices = predictionArray
//         .flatMap(recipeProbs =>
//             recipeProbs
//             .map((prob, index) => ({ prob, index })) // Map probabilities with their indices
//             .sort((a, b) => b.prob - a.prob) // Sort by probability in descending order
//             .slice(0, numberOfResults) // Take the top `numberOfResults` for each input
//             .map(item => item.index) // Get only the indices
//         );

//     return topRecipeIndices; // Flattened array of top indices
// };
