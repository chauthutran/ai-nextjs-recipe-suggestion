"use client";

import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';
import * as Constant from "@/lib/constant";
import * as dbService from "@/lib/mongodb";
import { useIngredient } from '@/contexts/IngredientContext';
import { JSONObject } from '@/lib/definations';
import { useRecipe } from '@/contexts/RecipeContext';
import RecipeDetails from './recipeList/RecipeDetails';
import RecipeSearch from './RecipeSearchPage';
import RecipeForm from './recipeList/RecipeForm';
import NumberDemo from './NumberDemo';
import RecipesByCategoryPage from './RecipesByCategoryPage';
import MealPlanPage from './MealPlanPage';
import { useApp } from '@/contexts/AppContext';


export default function AppWrapper() {

	const { appPage } = useApp();

	return (
		<div className="mx-5 my-5">
			
            {/* <button className='bg-blue-500 mr-10' onClick={() => dbService.updateImages() }>Update Images</button> */}
            {/* <button className='bg-blue-500 mr-10' onClick={() => dbService.updateCategories() }>Update Categories</button>
            <button className='bg-blue-500' onClick={() => dbService.getRecipesWithoutCategories() }>Recipes without Categories</button> */}
{/* <button className='bg-blue-500 mr-10' onClick={() => dbService.importIngredients() }>Import Ingredients</button> */}
{/* <button className='bg-blue-500 mr-10' onClick={() => dbService.updateMealTypes() }>Update MealTypes</button> */}
{/* <button className='bg-blue-500 mr-10' onClick={() => dbService.updateDietaryRestrictions() }>Update updateDietaryRestrictions</button> */}



			{appPage == Constant.PAGE_MEAL_PLAN && <MealPlanPage />}
			{appPage == Constant.PAGE_INGREDIENT_BASED_RECIPE_SUGGESTIONS && <RecipeSearch />}
			{appPage === Constant.PAGE_RECIPES_BY_CATEGORY && <RecipesByCategoryPage />}

			{/* <RecipeForm /> */}
			{/* <NumberDemo /> */}
			
			
		</div>
	);
}
