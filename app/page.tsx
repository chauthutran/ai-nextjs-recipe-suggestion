"use client";

import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';
import * as Constant from "@/lib/constant";
import * as dbService from "@/lib/mongodb";
import AppWrapper from './ui/AppWrapper';
import { IngredientProvider } from './contexts/IngredientContext';
import { RecipeProvider } from './contexts/RecipeContext';


export default function RecipeGenerator() {

	return (
		<IngredientProvider>
			<RecipeProvider>
				<AppWrapper />
			</RecipeProvider>
		</IngredientProvider>
	);
}
