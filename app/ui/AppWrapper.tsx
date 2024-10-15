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


export default function AppWrapper() {

	return (
		<div className="mx-5 my-5">
			<RecipeForm />
			<RecipeSearch />

			
		</div>
	);
}
