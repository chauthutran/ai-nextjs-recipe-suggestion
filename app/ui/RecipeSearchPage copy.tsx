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
import { useCategory } from '@/contexts/CategoryContext';
import * as Utils from "@/lib/utils";
import { useApp } from '@/contexts/AppContext';


export default function RecipeSearchPage() {

    const { categories, ingredients, recipes, model } = useApp();

    const [predictedRecipes, setPredictedRecipes] = useState<JSONObject[] | null>(null);
    const [inputText, setInputText] = useState('');

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

    function convertIngredientsToFeatures(
        inputText: string,
        ingredientsList: string[],
        categoriesList: string[]
    ): JSONObject {
        // Step 1: Normalize text to lowercase
        const normalizedText = inputText.toLowerCase();
        
        // Step 2: Create ingredient and category index maps
        const ingredientIndex: { [key: string]: number } = {};
        ingredientsList.forEach((ingredient, index) => {
            ingredientIndex[ingredient] = index;
        });
    
        const categoryIndex: { [key: string]: number } = {};
        categoriesList.forEach((category, index) => {
            categoryIndex[category] = index;
        });
    
        // Step 3: Generate one-hot vector for ingredients
        const ingredientVector = ingredients!.map(ingredient => 
            normalizedText.includes(ingredient.toLowerCase()) ? 1 : 0
        );
    
        // Step 4: Generate one-hot vector for categories
        const categoryVector = categoriesList!.map(categoryName => 
            normalizedText.includes(categoryName.toLowerCase()) ? 1 : 0
        );
    
        // Step 5: Return ingredient and category vectors
        return {ingredientVector, categoryVector};
    }

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
        
        const categoryNames = categories!.map(item => item.name);
        const featureArray = convertIngredientsToFeatures(inputText, ingredients!, categoryNames!);

        // Create tensors
        const ingredientTensor = tf.tensor2d([featureArray.ingredientVector], [1, featureArray.ingredientVector.length]);
        const categoryTensor = tf.tensor2d([featureArray.categoryVector], [1, featureArray.categoryVector.length]);

        // Perform the prediction
        const predictions = model.predict([ingredientTensor, categoryTensor]) as tf.Tensor[];
        // Get the recipe output tensor
        const recipeOutput = predictions[0]; // Recipe predictions
        const categoryOutput = predictions[1]; // Category predictions
        // // Convert the recipe output tensor to an array
        // const recipeProbabilities = await recipeOutput.array() as number[][];
        // // Convert the category output tensor to an array
        // const categoryProbabilities = await categoryOutput.array() as number[][];

            
        // Convert predictions to array
        const recipePredictions = await recipeOutput.data();
        const categoryPredictions = await categoryOutput.data();

        const topRecipeIndices = Array.from(recipePredictions)
            .map((pred, index) => ({ index, pred }))
            .sort((a, b) => b.pred - a.pred) // Sort in descending order
            .slice(0, 10) // Get top 10
        const topRecipes = topRecipeIndices.map(item => recipes![item.index]); // Assuming 'recipes' is your array of recipe names

    //     // Find the index of the highest probability for categories
    //     const topCategoryIndices = Array.from(categoryPredictions)
    //         .map((pred, index) => ({ index, pred }))
    //         .sort((a, b) => b.pred - a.pred) // Sort in descending order
    //         .slice(0, 12) // Get first one
    //     const topCategories = topCategoryIndices.map(item => categories![item.index]); // Assuming 'recipes' is your array of recipe names

    // console.log(topRecipes);
    // console.log(topCategories);

        const categoryPredictionsArray = Array.from(categoryPredictions); // Convert to a regular array
        const predictedCategoryIndex = categoryPredictions.indexOf(Math.max(...categoryPredictionsArray));
        const predictedCategory = categories![predictedCategoryIndex];
        const filteredRecipes = topRecipes.filter(recipe => {
        // Check if the recipe belongs to the predicted category
        return Utils.findItemFromList( recipe.categories, predictedCategory.name, "name"); // Adjust this condition based on your data structure
    });

        // // Assuming the model output is an array of probabilities for each recipe
        // // Get the top 3 predictions
        // const topIndices = predictedRecipe[0]
        //     .map((prob, index) => ({ index, prob }))
        //     .sort((a, b) => b.prob - a.prob)
        //     .slice(0, 10)
        //     .map(item => item.index);

        setPredictedRecipes( filteredRecipes );
    };


    if ( categories === null || ingredients === null || recipes === null || model === null ) return (
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
