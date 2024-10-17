"use client";

import { JSONObject } from '@/lib/definations';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as dbService from "@/lib/mongodb";
import * as Constant from "@/lib/constant";

interface CategoryContextProps {
	categories: JSONObject[] | null;

	// fetchCategorys: () => void;

	processStatus: string;
	error: string | null;
}

const CategoryContext = createContext<CategoryContextProps>({
	categories: null,

	// fetchCategorys: async () => { },

	processStatus: "",
	error: null
});

export const useCategory = (): CategoryContextProps => {
	const context = useContext(CategoryContext);

	if (!context) {
	  throw new Error('useCategory must be used within an CategoryProvider');
	}
	return context;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
	const [categories, setCategorys] = useState<JSONObject[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [processStatus, setProcessStatus] = useState<string>("");

	useEffect(() => {
        if (categories === null) {
            fetchCategories();
        }
    }, []);


	const fetchCategories = async () => {
		setProcessStatus(Constant.RESPONSE_CATEGORY_REQUEST);
		setError(null);

		const response: JSONObject = await dbService.fetchCategories();
		console.log(response);
		if (response.status != "success")  {
			setProcessStatus(Constant.RESPONSE_CATEGORY_FAILURE);
			setError(response.message);
		}
		else {
			// const list = response.data.map((item: JSONObject) => item.name )
			setCategorys(response.data);
			setProcessStatus(Constant.RESPONSE_CATEGORY_SUCCESS);
		}
	};

	return (
		<CategoryContext.Provider value={{  processStatus, error: error, categories }}>
			{children}
		</CategoryContext.Provider>
	);
};
