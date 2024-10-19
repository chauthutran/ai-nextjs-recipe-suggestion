"use client";

import { JSONObject } from "@/lib/definations";
import { useState } from "react";
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';
import { useApp } from "@/contexts/AppContext";
import SpinningIcon from "./basics/SpinningIcon";
import IngredientFilter from "./layout/IngredientFilter";
import * as Utils from "@/lib/utils";
import MealPreferences from "./layout/MealPreferences";
import * as Constant from "@/lib/constant";


export default function MealPlanPage() {

    const { categories, ingredients, recipes, model } = useApp();

    const [mealPlan, setMealPlan] = useState<JSONObject[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [predictedRecipes, setPredictedRecipes] = useState<JSONObject[] | null>(null);
    const [preferences, setPreferences] = useState<JSONObject>({
      mealType: 'lunch',
      dietaryRestrictions: 'vegan',
    });

    // const handleGenerateMealPlan = async () => {
    //     // Preprocess preferences if needed
    //     const processedInput = preprocessPreferences(preferences);
        
    //     // Generate meal plan using AI model
    //     await predictRecipe(processedInput);
    // };

    const preprocessPreferences = (preferences: JSONObject) => {
        // Example: Convert dietary restrictions to a suitable format for your model
        const dietaryMapping = {
            Vegetarian: [1, 0, 0, 0, 0],
            Vegan: [0, 1, 0, 0, 0],
            'Gluten-Free': [0, 0, 1, 0, 0],
            'Dairy-Free': [0, 0, 0, 1, 0],
            'Nut-Free': [0, 0, 0, 0, 1],
        };

        const dietaryRestrictions = dietaryMapping[preferences.dietaryRestrictions as keyof typeof dietaryMapping] || [0, 0, 0, 0, 0];

        return {
            mealType: preferences.mealType,
            dietaryRestrictions
        };
    };

    const predictRecipe = async() => {
      
        // const inputText = selectedIngredients.join(", ");
        // const ingredientArray = Utils.parseIngredients(ingredients!, inputText);

        // // Convert the user input (ingredient vector) to tensor
        // const inputTensor = tf.tensor2d([ingredientArray], [1, ingredientArray.length]);

        // Create tensors
        const categoryNames = categories!.map(item => item.name);
        const featureArray = Utils.convertIngredientsToFeatures(preferences.dietaryRestrictions, ingredients!, categoryNames, Constant.MEAL_TYPES, Constant.DIETARY_RESTRICTIONS);
        const ingredientTensor = tf.tensor2d([featureArray.ingredientVector], [1, featureArray.ingredientVector.length]);
        const categoryTensor = tf.tensor2d([featureArray.categoryVector], [1, featureArray.categoryVector.length]);

        // Make the prediction
       const predictions = model!.predict([ingredientTensor, categoryTensor]) as tf.Tensor[];

       
     
        // Get the recipe output tensor
        const recipeOutput = predictions[0] as tf.Tensor; // Recipe predictions
        const categoryOutput = predictions[1] as tf.Tensor; // Categories predictions
        const mealTypeOutput = predictions[2] as tf.Tensor; // Meal types predictions (if you included it)
        const dietaryRestrictionOutput = predictions[3] as tf.Tensor;

  // Convert the Tensors to arrays
  const recipeOutputArray = Array.isArray(recipeOutput) ? recipeOutput[0] : recipeOutput;
  const categoryOutputArray = Array.isArray(categoryOutput) ? categoryOutput[0] : categoryOutput;
  const mealTypeOutputArray = Array.isArray(mealTypeOutput) ? mealTypeOutput[0] : mealTypeOutput;
  const dietaryRestrictionOutputArray = Array.isArray(dietaryRestrictionOutput) ? dietaryRestrictionOutput[0] : dietaryRestrictionOutput;

// After prediction
const topRecipes = Utils.getTopPredictions(recipeOutputArray, 10); // Get top 5 recipes
const topMealTypes = Utils.getTopPredictions(mealTypeOutputArray, 1); // Get top 5 meal types (if included)


        // Fetch the predicted recipe from the database
        setPredictedRecipes(topRecipes);
    }

    if( recipes === null || model === null ) return ( <div className="flex space-x-5">
                        <div className="italic">Loading model</div>
                        <SpinningIcon className="text-gray-400" />
                    </div>);

    return (
        <>
            <MealPreferences onSubmit={(_preferences) => preprocessPreferences(_preferences)} />

            <IngredientFilter onFilterChange={(filtedIngredients) =>  setSelectedIngredients(filtedIngredients) } />

            <button className="px-3 py-1 bg-leaf-green" onClick={() => predictRecipe()}>Run</button>
        </>
    )
}