"use client";


import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';

const ingredientData = [
	// [1, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Chicken and carrot
	[1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // Carrot and potato
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Chicken and rice
	[0, 0, 1, 1, 0, 0, 0, 0, 0, 0], // Potato and rice
	[0, 0, 0, 1, 1, 0, 0, 0, 0, 0], // Rice and pepper
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 0], // Chicken, pepper, and tomato
	[0, 0, 0, 0, 1, 0, 1, 1, 0, 0], // Pepper, onion, and garlic
	[0, 0, 0, 0, 0, 0, 0, 1, 1, 0], // Garlic and beef
	[0, 0, 0, 0, 0, 1, 1, 0, 1, 0], // Tomato, onion, and beef
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 1], // Garlic and pasta
];

// Ingredient presence per recipe
// const recipeData = [
// 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Chicken Soup
// 	[0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // Vegetable Stir Fry
// 	[0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Chicken and Rice
// 	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Potato Rice Pilaf
// 	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Spicy Rice and Pepper
// 	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Chicken Stew
// 	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Garlic Onion Stir Fry
// 	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // Beef Garlic Roast
// 	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0], // Beef Stew
// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Garlic Pasta
// ];
const recipeData = [
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
	[1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	[0, 0, 0, 0, 0, 1, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 1]
];

const recipeList = [
	'Chicken Soup',         // [1, 1, 0, 0, 0, 0, 0, 0, 0, 0] -> Chicken and carrot
	'Vegetable Stir Fry',   // [0, 1, 1, 0, 0, 0, 0, 0, 0, 0] -> Carrot and potato
	'Chicken and Rice',     // [1, 0, 0, 1, 0, 0, 0, 0, 0, 0] -> Chicken and rice
	'Potato Rice Pilaf',    // [0, 0, 1, 1, 0, 0, 0, 0, 0, 0] -> Potato and rice
	'Spicy Rice and Pepper',// [0, 0, 0, 1, 1, 0, 0, 0, 0, 0] -> Rice and pepper
	'Chicken Stew',         // [1, 0, 0, 0, 1, 1, 0, 0, 0, 0] -> Chicken, pepper, and tomato
	'Garlic Onion Stir Fry',// [0, 0, 0, 0, 1, 0, 1, 1, 0, 0] -> Pepper, onion, and garlic
	'Beef Garlic Roast',    // [0, 0, 0, 0, 0, 0, 0, 1, 1, 0] -> Garlic and beef
	'Beef Stew',            // [0, 0, 0, 0, 0, 1, 1, 0, 1, 0] -> Tomato, onion, and beef
	'Garlic Pasta',         // [0, 0, 0, 0, 0, 0, 0, 1, 0, 1] -> Garlic and pasta
];

const ingredients = ['chicken', 'carrot', 'potato', 'rice', 'pepper', 'tomato', 'onion', 'garlic', 'beef', 'pasta'];

export default function RecipeGenerator() {
	const [model, setModel] = useState<tf.Sequential | null>(null);
	// const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [recipe, setRecipe] = useState('');

	const [inputText, setInputText] = useState('');

	// // Load the model once when the component mounts
	useEffect(() => {
		loadModel();
	}, []);


	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(event.target.value);
	};

	const parseIngredients = (text: string) => {
		// Basic keyword-based parsing (expand this list as needed)

		// Initialize an array of 10 ingredients (all 0 by default)
		const ingredientArray = Array(ingredients.length).fill(0);

		// Check if the text contains any known ingredient and mark it as "1" in the array
		ingredients.forEach((ingredient, index) => {
			if (text.toLowerCase().includes(ingredient)) {
				ingredientArray[index] = 1;
			}
		});

		return ingredientArray;
	};


	const loadModel = async () => {
		const model = createRecipeModel();

		// Train the model
		await trainRecipeModel(model, ingredientData, recipeData);
		console.log('Model trained:', model);
		setModel(model); // Store the trained model
	};

	const predictRecipe = async () => {
		if (!model) {
			alert('Model not loaded.');
			return;
		}

		// Parse the input text to get ingredient array
		const ingredientArray = parseIngredients(inputText);

		// Ensure that the input has exactly 10 ingredients
		if (ingredientArray.length !== 10) {
			alert("The input must contain exactly 10 values.");
		}
console.log("ingredientArray", ingredientArray);
		// Convert the array to a tensor and predict the recipe
		const inputTensor = tf.tensor2d([ingredientArray], [1, 10]);
		const prediction = model.predict(inputTensor) as tf.Tensor;

		console.log("inputTensor", inputTensor);
console.log("prediction", prediction);

		// Get the index of the highest predicted value
		const predictedRecipeIndex = prediction.argMax(-1).dataSync()[0];
console.log("predictedRecipeIndex", predictedRecipeIndex);


		setRecipe(`You can cook: ${recipeList[predictedRecipeIndex]}`);
	};

	// if (model === null) return (<div>Loading ...</div>);


	return (
		<div className="container">
			<h1>Recipe Suggestion</h1>
			<input
				type="text"
				value={inputText}
				onChange={handleInputChange}
				className="border border-gray-300"
				placeholder="I have chicken and carrots, what can I cook?"
			/>
			<button className="bg-blue-500" onClick={predictRecipe}>Find Recipe</button>

			{recipe && <p>{recipe}</p>}


			<div className="flex space-x-3">
				<button className="bg-blue-500" onClick={loadModel}>Load Model</button>
				{/* <button className="bg-blue-500" onClick={predictRecipe}>Generate Recipe</button> */}
			</div>
			{/* 
      {recipe && (
        <div>
          <h2>Suggested Recipe:</h2>
          <p>{recipe}</p>
        </div>
      )} */}
		</div>
	);
}
