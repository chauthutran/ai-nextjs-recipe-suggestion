"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as dbService from "@/lib/mongodb";
import * as Constant from "@/lib/constant";

interface RecipeContextProps {
	recipes: JSONObject[] | null;
	recipeData: number[][] | null;

	processStatus: string;
	error: string | null;
}

const RecipeContext = createContext<RecipeContextProps>({
	recipes: null,
	recipeData: null,

	processStatus: "",
	error: null
});

export const useRecipe = (): RecipeContextProps => {
	const context = useContext(RecipeContext);

	if (!context) {
	  throw new Error('useRecipe must be used within an RecipeProvider');
	}
	return context;
};

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
	const [recipes, setRecipes] = useState<JSONObject[] | null>(null);
	const [recipeData, setRecipeData] = useState<number[][] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processStatus, setProcessStatus] = useState<string>("");

	useEffect(() => {
        if (recipeData === null) {
            fetchRecipes();
        }
    }, []);


	const fetchRecipes = async () => {
		setProcessStatus(Constant.RESPONSE_RECIPE_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.fetchRecipes();

		if (response.status === "error" )  {
			setProcessStatus(Constant.RESPONSE_RECIPE_FAILURE);
			setError(response.message);
		}
		else {
			const _recipes = response.data;
			const _recipeData = _recipes.map((item: JSONObject) => item.name );
			setRecipes( _recipes );
			setRecipeData(_recipeData);
			setProcessStatus(Constant.RESPONSE_RECIPE_SUCCESS);
		}
	};

	return (
		<RecipeContext.Provider value={{  processStatus, error: error, recipes, recipeData }}>
			{children}
		</RecipeContext.Provider>
	);
};
