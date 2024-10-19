"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as dbService from "@/lib/mongodb";
import * as Constant from "@/lib/constant";
import * as tf from '@tensorflow/tfjs';
import { createRecipeModel, trainRecipeModel } from '@/lib/tensorflow/model';



interface AppContextProps {
	ingredients: string[] | null;
	categories: JSONObject[] | null;
	recipes: JSONObject[] | null;
	model: tf.LayersModel | null;

	// fetchApps: () => void;

	processStatus: string;
	error: string | null;
}

const AppContext = createContext<AppContextProps>({
	ingredients: null,
	categories: null,
	recipes: null,
	model: null,

	// fetchApps: async () => { },

	processStatus: "",
	error: null
});

export const useApp = (): AppContextProps => {
	const context = useContext(AppContext);

	if (!context) {
	  throw new Error('useApp must be used within an AppProvider');
	}
	return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [model, setModel] = useState<tf.LayersModel | null>(null);
    const [ingredients, setIngredients] = useState<string[] | null>(null);
	const [categories, setCategorys] = useState<JSONObject[] | null>(null);
	const [recipes, setRecipes] = useState<JSONObject[] | null>(null);

	const [error, setError] = useState<string | null>(null);
	const [processStatus, setProcessStatus] = useState<string>("");

	useEffect(() => {
		if (categories === null) {
			fetchCategories();
		}
        else if (ingredients === null) {
			fetchIngredients();
		}
        else if (recipes === null) {
			fetchRecipes();
		}
		else if( categories !== null && ingredients !== null && recipes!== null ) {
			loadModel();
		}
    }, [ingredients, categories, recipes]);


	const fetchIngredients = async () => {
		setProcessStatus(Constant.RESPONSE_INGREDIENT_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.fetchIngredients();
		console.log(response);
		if (response.status != "success")  {
			setProcessStatus(Constant.RESPONSE_INGREDIENT_FAILURE);
			setError(response.message);
		}
		else {
			const list = response.data.map((item: JSONObject) => item.name )
			setIngredients(list);
			setProcessStatus(Constant.RESPONSE_INGREDIENT_SUCCESS);
		}
	};


	const fetchCategories = async () => {
		setProcessStatus(Constant.RESPONSE_CATEGORY_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.fetchCategories();
		if (response.status != "success")  {
			setProcessStatus(Constant.RESPONSE_CATEGORY_FAILURE);
			setError(response.message);
		}
		else {
			setCategorys(response.data);
			setProcessStatus(Constant.RESPONSE_CATEGORY_SUCCESS);
		}
	};

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
			// const _recipeData = _recipes.map((item: JSONObject) => item.name );
			setRecipes( _recipes );
			// setRecipeData(_recipeData);
			setProcessStatus(Constant.RESPONSE_RECIPE_SUCCESS);
		}
	};

	
    const loadModel = async () => {
        console.log("Model is loading");

        const _model = createRecipeModel(ingredients!.length, recipes!.length, categories!.length, Constant.MEAL_TYPES.length, Constant.DIETARY_RESTRICTIONS.length);

        // Train the model
        const categoryNames = categories?.map(item => item.name);
        await trainRecipeModel(_model, recipes!, ingredients!, categoryNames!, Constant.MEAL_TYPES, Constant.DIETARY_RESTRICTIONS);

        console.log("Model is loaded");

        setModel(_model); // Store the trained model
    };


	return (
		<AppContext.Provider value={{  processStatus, error: error, ingredients, categories, recipes, model }}>
			{children}
		</AppContext.Provider>
	);
};
