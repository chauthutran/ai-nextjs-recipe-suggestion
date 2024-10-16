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


export default function RecipeSearchPage() {

    const { categories } = useCategory();
    const { ingredients } = useIngredient();
    const { recipeData, recipes } = useRecipe();

    const [model, setModel] = useState<tf.LayersModel | null>(null);
    // const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [predictedRecipes, setPredictedRecipes] = useState<JSONObject[] | null>(null);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if( categories !== null && ingredients !== null && recipeData!== null && recipes !== null ) {
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
        const _model = createRecipeModel(ingredients!.length, recipes!.length, categories!.length);

        console.log("Model is loading 1");
        const categoryNames = categories?.map(item => item.name);
        // Train the model
        await trainRecipeModel(_model, recipes!, ingredients!, categoryNames!);
        console.log("Model is loaded");

        setModel(_model); // Store the trained model
    };

    function convertIngredientsToFeatures(
        inputText: string,
        ingredientsList: string[],
        categoriesList: string[]
    ): number[] {
        // Step 1: Normalize text to lowercase
        const normalizedText = inputText.toLowerCase();
        
        // Step 2: Tokenization
        const tokens = normalizedText.split(/\s+/);
        
        // Step 3: Remove stop words
        const stopWords: string[] = ["i", "to", "with", "want", "cook", "the", "and", "for"]; // Add more as needed
        const filteredTokens = tokens.filter(token => !stopWords.includes(token));
        
        // Step 4: Create ingredient and category index maps
        const ingredientIndex: { [key: string]: number } = {};
        ingredientsList.forEach((ingredient, index) => {
            ingredientIndex[ingredient] = index;
        });
    
        const categoryIndex: { [key: string]: number } = {};
        categoriesList.forEach((category, index) => {
            categoryIndex[category] = index;
        });
    
        // Step 5: Generate one-hot vector for ingredients
        const ingredientVector = Array(ingredientsList.length).fill(0);
        filteredTokens.forEach(token => {
            if (ingredientIndex[token] !== undefined) {
                ingredientVector[ingredientIndex[token]] = 1; // Set to 1 if the ingredient is present
            }
        });
    
        // Step 6: Generate one-hot vector for categories
        const categoryVector = Array(categoriesList.length).fill(0);
        const identifiedCategories = filteredTokens.filter(token => categoryIndex[token] !== undefined);
        identifiedCategories.forEach(category => {
            if (categoryIndex[category] !== undefined) {
                categoryVector[categoryIndex[category]] = 1; // Set to 1 if the category is present
            }
        });
    
        // Step 7: Combine ingredient and category vectors
        const combinedInputVector = ingredientVector.concat(categoryVector);
    
        return combinedInputVector; // Return the final feature vector
        // return ingredientVector;
    }

    // function convertIngredientsToFeatures(inputText: string, ingredients: string[], categoryNames: string[]): number[][] {
    //     const featureVector = new Array(ingredients.length).fill(0);
      
    //     // Parse the input text for ingredients and mark the feature vector accordingly
    //     ingredients.forEach((ingredient, index) => {
    //       if (inputText.toLowerCase().includes(ingredient.toLowerCase())) {
    //         featureVector[index] = 1;
    //       }
    //     });
      
    //     // Return a 2D array, since TensorFlow.js expects a 2D tensor (even for a single input)
    //     return [featureVector]; // Wrap in an array to make it 2D
    //   }
    

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
        // const inputTensor = tf.tensor2d([ingredientArray], [1, ingredients!.length]);
        
        const categoryNames = categories!.map(item => item.name);
        const inputTensor = tf.tensor2d(convertIngredientsToFeatures(inputText, ingredients!, categoryNames!));


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


    if ( categories === null || ingredients === null || recipeData === null || model === null ) return (
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
