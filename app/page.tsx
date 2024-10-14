"use client";

import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';
import * as Constant from "@/lib/constant";
import * as dbService from "@/lib/mongodb";


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
		const ingredientArray = Array(Constant.ingredients.length).fill(0);

		// Check if the text contains any known ingredient and mark it as "1" in the array
		Constant.ingredients.forEach((ingredient, index) => {
			if (text.toLowerCase().includes(ingredient)) {
				ingredientArray[index] = 1;
			}
		});

		return ingredientArray;
	};


	const loadModel = async () => {
		const model = createRecipeModel();

		// Train the model
		await trainRecipeModel(model, Constant.ingredientData, Constant.ingredientData);
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
		if (ingredientArray.length !== Constant.ingredients.length) {
			alert("The input must contain exactly 10 values.");
		}
		
		// Convert the array to a tensor and predict the recipe
		const inputTensor = tf.tensor2d([ingredientArray], [1, Constant.ingredients.length]);
		const prediction = model.predict(inputTensor) as tf.Tensor;

		// console.log("inputTensor", await prediction.array());

		// Get the index of the highest predicted value
		const predictedRecipeIndex = prediction.argMax(-1).dataSync()[0];


		setRecipe(`You can cook: ${Constant.recipeNames[predictedRecipeIndex]}`);
	};

	if (model === null) return (<div>Loading ...</div>);

	const handleUpdateRecipes = async() => {
		console.log("===== handleUpdateRecipes ");
		await dbService.updateRecipes();
	}

	return (
		<div className="container">
			{/* <button className='bg-yellow-500' onClick={() => handleUpdateRecipes()}>Update recipes data</button> */}
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
