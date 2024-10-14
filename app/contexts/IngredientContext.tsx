"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as dbService from "@/lib/mongodb";
import * as Constant from "@/lib/constant";

interface IngredientContextProps {
	ingredients: string[] | null;

	// fetchIngredients: () => void;

	processStatus: string;
	error: string | null;
}

const IngredientContext = createContext<IngredientContextProps>({
	ingredients: null,

	// fetchIngredients: async () => { },

	processStatus: "",
	error: null
});

export const useIngredient = (): IngredientContextProps => {
	const context = useContext(IngredientContext);

	if (!context) {
	  throw new Error('useIngredient must be used within an IngredientProvider');
	}
	return context;
};

export const IngredientProvider = ({ children }: { children: ReactNode }) => {
	const [ingredients, setIngredients] = useState<string[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processStatus, setProcessStatus] = useState<string>("");

	useEffect(() => {
        if (ingredients === null) {
            fetchIngredients();
        }
    }, []);


	const fetchIngredients = async () => {
		setProcessStatus(Constant.RESPONSE_INGREDIENT_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.fetchIngredients();
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

	return (
		<IngredientContext.Provider value={{  processStatus, error: error, ingredients }}>
			{children}
		</IngredientContext.Provider>
	);
};
