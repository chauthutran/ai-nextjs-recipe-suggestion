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
import * as Constant from "@/lib/constant";


export default function RecipeSearchPage() {

    const { categories } = useCategory();
    const { ingredients } = useIngredient();
    const { recipeData, recipes } = useRecipe();

    // const [model, setModel] = useState<tf.Sequential | null>(null);
    const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [predictedRecipes, setPredictedRecipes] = useState<JSONObject[] | null>(null);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        if (categories !== null && ingredients !== null && recipeData !== null && recipes !== null) {
            loadModel();
        }
    }, [ingredients, recipeData, recipes])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const loadModel = async () => {
        console.log("Model is loading");
        const _model = createRecipeModel(ingredients!.length, recipes!.length, categories!.length, Constant.MEAL_TYPES.length, Constant.DIETARY_RESTRICTIONS.length);

        const categoryNames = categories?.map(item => item.name);
        // Train the model
        await trainRecipeModel(_model, recipes!, ingredients!, categoryNames!, Constant.MEAL_TYPES, Constant.DIETARY_RESTRICTIONS);
        console.log("Model is loaded");

        setModel(_model); // Store the trained model
    };

    const predictRecipe = async () => {
        if (!model) {
            alert('Model not loaded.');
            return;
        }

        // const categoryNames = categories!.map(item => item.name);

        // const ingredientArray = Utils.convertIngredientToFeatures(inputText, ingredients!);
        // const categoryArray = Utils.convertCategoryToFeatures(inputText, categoryNames);
        // const mealTypeArray = Utils.convertMealTypeToFeatures(inputText, Constant.MEAL_TYPES);
        // const dietaryRestrictionArray = Utils.convertDietaryRestrictionToFeatures(inputText, Constant.DIETARY_RESTRICTIONS);

        // // Create tensors
        // const ingredientTensor = tf.tensor2d([ingredientArray], [1, ingredients!.length]);
        // const categoryTensor = tf.tensor2d([categoryArray], [1, categories!.length]);
        // const mealTypeTensor = tf.tensor2d([mealTypeArray], [1, Constant.MEAL_TYPES.length]);
        // const dietaryRestrictionTensor = tf.tensor2d([dietaryRestrictionArray], [1, Constant.DIETARY_RESTRICTIONS.length]);

        // // Perform the prediction
        // const predictions = model.predict([ingredientTensor, categoryTensor, mealTypeTensor, dietaryRestrictionTensor]) as tf.Tensor[];
        // // Get the recipe output tensor
        // const recipeOutput = predictions[0]; // Recipe predictions
        // const categoryOutput = predictions[1]; // Category predictions
        // const mealTypeOutput = predictions[2]; // Mealtype predictions
        // const dietaryRestrictionOutput = predictions[3]; // dietaryRestriction predictions
        
        //     // Convert predictions to array
        //     const recipePredictions = await recipeOutput.data();
        //     const categoryPredictions = await categoryOutput.data();
        //     const mealTypePredictions = await mealTypeOutput.data();
        //     const dietaryRestrictionPredictions = await dietaryRestrictionOutput.data();


        //     const predictedRecipes = Utils.getTopPredictions( Array.from(recipePredictions), 10, recipes!);
        //     const predictedCategories = Utils.getTopPredictions( Array.from(categoryPredictions), 3, categoryNames!);
        //     const predictedMealTypes: string[] = Utils.getTopPredictions( Array.from(mealTypePredictions), 1, Constant.MEAL_TYPES);
        //     const preditedDietaryRestrictions = Utils.getTopPredictions( Array.from(dietaryRestrictionPredictions), 1,  Constant.DIETARY_RESTRICTIONS);

        //     const filterRecipes = () => {
        //         // Filter recipes based on dietary restrictions and meal type
        //         return predictedRecipes.filter((recipe: JSONObject) => 
        //             recipe.categories.filter((item: JSONObject) => predictedCategories.includes(item.name)).length > 0
        //             && recipe.mealTypes.filter((item: string) => predictedMealTypes.includes(item)).length > 0
        //             && recipe.dietaryRestrictions.filter((item: string) => preditedDietaryRestrictions.includes(item)).length > 0

        //             // recipe.mealType === mealType && recipe.dietaryRestriction.includes(dietaryRestriction)
        //         );
        //     };

            const filterRecipes = await Utils.preditRecipes(inputText, ingredients!, categories!, recipes!, model!)
            setPredictedRecipes( filterRecipes );

            // const topRecipeIndices = Array.from(recipePredictions)
            //     .map((pred, index) => ({ index, pred }))
            //     .sort((a, b) => b.pred - a.pred) // Sort in descending order
            //     .slice(0, 10) // Get top 10
            // const topRecipes = topRecipeIndices.map(item => recipes![item.index]); // Assuming 'recipes' is your array of recipe names

            // const categoryPredictionsArray = Array.from(categoryPredictions); // Convert to a regular array
            // const predictedCategoryIndex = categoryPredictions.indexOf(Math.max(...categoryPredictionsArray));
            // const predictedCategory = categories![predictedCategoryIndex];

            // const filteredRecipes = topRecipes.filter(recipe => {
            // Check if the recipe belongs to the predicted category
        //     return Utils.findItemFromList( recipe.categories, predictedCategory.name, "name"); // Adjust this condition based on your data structure
        // });
        // const top10Indexes = await Utils.getTopPredictionIndexes(predictions, 10);
        // const top10Recipes = recipes!.filter((recipe, idx) => top10Indexes.indexOf(idx) >= 0);

        // setPredictedRecipes(top10Recipes);
    };


    if (categories === null || ingredients === null || recipeData === null || model === null) return (
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
