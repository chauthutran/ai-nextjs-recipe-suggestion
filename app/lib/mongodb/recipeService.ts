"use server";

import connectToDatabase from "@/lib/mongodb/db";
import Recipe from "./schemas/Recipe.schema";
import * as Utils from "@/lib/utils";
import Ingredient from "./schemas/Ingredient.schema";

export async function fetchRecipes() {
	try {
		await connectToDatabase();

		const recipes = await Recipe.find();

		return { status: "success", data: Utils.cloneJSONObject(recipes) };
	} catch (error) {
		return { status: "error", data: Utils.getResponseErrMessage(error) };
	}
}

// Function to update ingredientData for ALL existing recipes in Mongodb
export async function updateIngredientDataForRecipes() {
	try {
		await connectToDatabase();
        let ingredientList = await Ingredient.find({}, "name");
        ingredientList = ingredientList.map((item) => item.name);

        const recipes = await Recipe.find({}).lean();
		console.log(recipes);
		for (let i = 0; i < recipes.length; i++) {
			const recipe = recipes[i];
			const ingredients = recipe.ingredients.join(" ");
			const ingredientData = parseIngredients(
				ingredients,
				ingredientList
			);
			recipe.ingredientData = ingredientData;

			// Upsert (update or insert) the recipe
			const data = await Recipe.findByIdAndUpdate(recipe._id, recipe, {
				new: true,
			});
		}

		console.log("Recipes updated successfully!");
	} catch (error) {
		console.error("Error updating recipes:", error);
	}
}

const parseIngredients = (text: string, ingredients: string[]): number[] => {
	// Basic keyword-based parsing (expand this list as needed)

	// Initialize an array of 10 ingredients (all 0 by default)
	const ingredientArray = Array(ingredients.length).fill(0);

	// Check if the text contains any known ingredient and mark it as "1" in the array
	ingredients.forEach((ingredient, index) => {
		if (text.toLowerCase().includes(ingredient.toLowerCase())) {
			ingredientArray[index] = 1;
		}
	});

	return ingredientArray;
};
