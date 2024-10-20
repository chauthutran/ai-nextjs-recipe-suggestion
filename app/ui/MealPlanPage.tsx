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
import ReceipeList from "./recipeList/RecipeList";


export default function MealPlanPage() {

    const { categories, ingredients, recipes, model } = useApp();

    // const [mealPlan, setMealPlan] = useState<JSONObject[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [preferences, setPreferences] = useState<JSONObject>({
        mealType: 'lunch',
        dietaryRestrictions: 'vegan',
    });
    const [predictedRecipes, setPredictedRecipes] = useState<JSONObject[] | null>(null);


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

        setPreferences({
            mealType: preferences.mealType,
            dietaryRestrictions
        });
    };

    const predictRecipe = async () => {
        console.log("loading ... ");
        // // Create tensors
        // const ingredientArray = new Array(ingredients!.length).fill(0);
        // const categoryArray = new Array(categories!.length).fill(0);
        // const mealTypeArray = Utils.convertMealTypeToFeatures(preferences.mealType, Constant.MEAL_TYPES);
        // const dietaryRestrictionArray = Utils.convertMealTypeToFeatures(preferences.mealType, Constant.DIETARY_RESTRICTIONS);

        // const ingredientTensor = tf.tensor2d([ingredientArray], [1, ingredients!.length]);
        // const categoryTensor = tf.tensor2d([categoryArray], [1, categories!.length]);
        // const mealTypeTensor = tf.tensor2d([mealTypeArray], [1, Constant.MEAL_TYPES.length]);
        // const dietaryRestrictionTensor = tf.tensor2d([dietaryRestrictionArray], [1, Constant.DIETARY_RESTRICTIONS.length]);

        // // Make the prediction
        // const predictions = model!.predict([ingredientTensor, categoryTensor, mealTypeTensor, dietaryRestrictionTensor]) as tf.Tensor;

        // const top10Indexes = await Utils.getTopPredictionIndexes(predictions, 10);
        // const top10Recipes = recipes!.filter((recipe, idx) => top10Indexes.indexOf(idx) >= 0);

        const preditMealPlan = await Utils.preditMealPlan(preferences, ingredients!,categories!, recipes!, model!);

        console.log("... DONE", preditMealPlan);
        setPredictedRecipes(preditMealPlan);
    }

    if (recipes === null || model === null) return (<div className="flex space-x-5">
        <div className="italic">Loading model</div>
        <SpinningIcon className="text-gray-400" />
    </div>);

    return (
        <>
            <MealPreferences onSubmit={(_preferences) => preprocessPreferences(_preferences)} />

            <IngredientFilter onFilterChange={(filtedIngredients) => setSelectedIngredients(filtedIngredients)} />

            <button className="px-3 py-1 bg-leaf-green" onClick={() => predictRecipe()}>Run</button>

            {predictedRecipes !== null && <ReceipeList data={predictedRecipes} />}
        </>
    )
}