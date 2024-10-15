"use server";

import * as Utils from '@/lib/utils';
import connectToDatabase from "./db";
import Ingredient from "./schemas/Ingredient.schema";

export async function fetchIngredients() {
    try {
        
        await connectToDatabase();
        const ingredients = await Ingredient.find().sort({index: 1});
        
        return { status: "success", data: Utils.cloneJSONObject(ingredients)};
    } catch (error) {
        return { status: "error", data: Utils.getResponseErrMessage(error)};
    }
  }