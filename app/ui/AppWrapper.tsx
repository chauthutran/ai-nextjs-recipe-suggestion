"use client";

import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';
import * as Constant from "@/lib/constant";
import * as dbService from "@/lib/mongodb";
import { useIngredient } from '@/contexts/IngredientContext';
import { JSONObject } from '@/lib/definations';
import { useRecipe } from '@/contexts/RecipeContext';
import RecipeDetails from './RecipeDetails';


export default function AppWrapper() {
    
    const { ingredients } = useIngredient();
    const { recipeData, recipes } = useRecipe();

	const [model, setModel] = useState<tf.Sequential | null>(null);
	// const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [recipe, setRecipe] = useState<JSONObject | null>(null);

	const [inputText, setInputText] = useState('');

	// // // Load the model once when the component mounts
	// useEffect(() => {
	// 	loadModel();
	// }, []);


	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(event.target.value);
	};

	const parseIngredients = (text: string) => {
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


	const loadModel = async () => {
		const model = createRecipeModel(ingredients!.length, recipes!.length);

		// Train the model
		await trainRecipeModel(model, recipes!);
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
		if (ingredientArray.length !== ingredients!.length) {
			alert(`The input must contain exactly ${ingredients!.length} values.`);
		}
		
		// Convert the array to a tensor (1 sample with `ingredients.length` features) and predict the recipe
		const inputTensor = tf.tensor2d([ingredientArray], [1, ingredients!.length]);
        // Perform the prediction
		const prediction = model.predict(inputTensor) as tf.Tensor;
		// console.log("inputTensor", await prediction.array());

        // Get the predicted class index from the prediction
        const predictionArray = prediction.arraySync() as number[][]; // Convert tensor to array
        const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0])); // Get the index of the highest value

        // Check if the predictedIndex corresponds to any recipe in the database
        if (predictedIndex >= 0 && predictedIndex < recipes!.length) {
            const predictedRecipe = recipes![predictedIndex];

            // Log the predicted recipe name and return it
            console.log('Predicted Recipe:', predictedRecipe);
            // return predictedRecipe;
            setRecipe(predictedRecipe);
            

		// // Get the index of the highest predicted value
		// const predictedRecipeIndex = prediction.argMax(-1).dataSync()[0];


		// setRecipe(`You can cook: ${recipeNames[predictedRecipeIndex]}`);
        }
	};


	// if (model === null) return (<div>Loading ...</div>);
    if( ingredients === null ) return (<div>Loading ingredients ...</div>)
    if( recipeData === null ) return (<div>Loading recipe data ...</div>)

	return (
		<div className="container">
            {/* <button className='bg-red-600' onClick={() => dbService.updateIngredientDataForRecipes()}>Update</button> */}
			<h1>Recipe Suggestion</h1>
			<input
				type="text"
				value={inputText}
				onChange={handleInputChange}
				className="border border-gray-300"
				placeholder="I have chicken and carrots, what can I cook?"
			/>
			<button className="bg-blue-500" onClick={predictRecipe}>Find Recipe</button>

			{/* {recipe && <p>{recipe}</p>} */}


			<div className="flex space-x-3">
				<button className="bg-blue-500" onClick={loadModel}>Load Model</button>
				{/* <button className="bg-blue-500" onClick={predictRecipe}>Generate Recipe</button> */}
			</div>
			
      {recipe && (
        <div>
          <h2>Suggested Recipe:</h2>
          <RecipeDetails data={recipe} />
          {/* <<p>{recipe}</p>> */}
        </div>
      )}
		</div>
	);
}
