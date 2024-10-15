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
