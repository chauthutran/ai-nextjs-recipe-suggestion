"use client";

import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';
import { useIngredient } from '@/contexts/IngredientContext';
import { JSONObject } from '@/lib/definations';
import { useRecipe } from '@/contexts/RecipeContext';
import RecipeDetails from './recipeList/RecipeDetails';
import SpinningIcon from './basics/SpinningIcon';
import { GiSolidLeaf } from 'react-icons/gi';
import { SiLeaflet } from 'react-icons/si';
import Image from 'next/image';
import ReceipeList from './recipeList/RecipeList';


export default function RecipeSearchPage() {

    const { ingredients } = useIngredient();
    const { recipeData, recipes } = useRecipe();

    const [model, setModel] = useState<tf.Sequential | null>(null);
    // const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [predictedRecipes, setPredictedRecipes] = useState<JSONObject[] | null>(null);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if( ingredients !== null && recipeData!== null && recipes !== null ) {
            loadModel();
        }
    }, [ingredients, recipeData, recipes])

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
        console.log("Model is loading");
        const _model = createRecipeModel(ingredients!.length, recipes!.length);

        // Train the model
        await trainRecipeModel(_model, recipes!, ingredients!);
        console.log("Model is loaded");

        setModel(_model); // Store the trained model
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
        // console.log("Prediction Array", await prediction.array());

        // // Get the predicted class index from the prediction
        // const predictionArray = prediction.arraySync() as number[][]; // Convert tensor to array
        // console.log("====== Prediction Array 1", predictionArray[0]);
        // console.log("Prediction Array 2", Math.max(...predictionArray[0]));


        // Convert prediction to array and get the predicted probabilities
        const predictedProbabilities = await prediction.array() as number[][]; // Directly assert to number[][]


        // Assuming the model output is an array of probabilities for each recipe
        // Get the top 3 predictions
        const topIndices = predictedProbabilities[0]
            .map((prob, index) => ({ index, prob }))
            .sort((a, b) => b.prob - a.prob)
            .slice(0, 10)
            .map(item => item.index);

        // Get the recipe names for the top predictions
        const predictedRecipes = topIndices.map(index => recipes![index]);

        setPredictedRecipes(predictedRecipes);
    };


    if (ingredients === null || recipeData === null || model === null ) return (
        <div className="flex space-x-5">
            <div className="italic">Loading data and model</div>
            <SpinningIcon className="text-gray-400" />
        </div>);


    return (
        <>
            <h1 className="text-2xl mb-3">Ingredient-Based Recipe Suggestions</h1>

            <div className="grid grid-cols-2 space-x-10 space-y-5 text-black justify-center">
                {predictedRecipes === null && <div className="text-green-800 space-y-2 items-center">
                    <div className="">
                        <p>Please input ingredients what you have on hand (e.g., chicken, rice, tomatoes), and we will suggest recipes that can be made using those ingredients.</p>
                        <p>Filter recipes by the number of ingredients.</p>
                    </div>
                </div>}

                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-3 rounded-l-md focus:outline-none focus:ring-1 focus:ring-leaf-green w-full"
                        placeholder="I have chicken and carrots, what can I cook?"
                    />
                    <button
                        className="bg-leaf-green px-4 py-3 text-white rounded-r-md transition-colors duration-300 hover:bg-green-700 focus:ring-1 focus:ring-offset-2 focus:ring-leaf-green"
                        onClick={predictRecipe}
                    >
                        Find
                    </button>
                </div>

                {/* <div className="">
                    <button className="bg-leaf-green px-3 py-2 rounded-md text-white" onClick={loadModel}>Load Model</button>
                </div> */}
            </div>

            {predictedRecipes !== null && (
                <div>
                     <h2 className="text-xl mb-3 mt-10">Suggested Recipe</h2>
                    {/* {predictedRecipes.map((recipe: JSONObject) => (
                        <RecipeDetails key={`predit_${recipe._id}`} data={recipe} />
                    ))} */}
                    <ReceipeList data={predictedRecipes} />
                </div>
            )}
        </>
    );
}
