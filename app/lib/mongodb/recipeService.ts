'use server';

import connectToDatabase from "@/lib/mongodb/db";
import Recipe from "./schemas/Recipe.schema";
import * as Constant from "@/lib/constant";

// Function to update or insert recipes
export async function updateRecipes() {
    try {
        
		console.log("----- updateRecipes ");

    await connectToDatabase();
    const recipes = await Recipe.find({}).lean();
    console.log(recipes);
      for (let i=0; i<recipes.length; i++ ) {
        const recipe = recipes[i];
        const ingredients = recipe.ingredients.join(" ");
        const ingredientData = parseIngredients(ingredients);
        recipe.ingredientData = ingredientData;
        
        // Upsert (update or insert) the recipe
        console.log(recipe);
        const data = await Recipe.findByIdAndUpdate(recipe._id, recipe, { new: true });
        console.log(data.ingredientData);
      }
      
      console.log('Recipes updated successfully!');
    } catch (error) {
      console.error('Error updating recipes:', error);
    } finally {
    //   mongoose.connection.close();
    }
  }
  

const parseIngredients = (text: string): number[] => {
    // Basic keyword-based parsing (expand this list as needed)

    // Initialize an array of 10 ingredients (all 0 by default)
    const ingredientArray = Array(Constant.ingredients.length).fill(0);

    // Check if the text contains any known ingredient and mark it as "1" in the array
    Constant.ingredients.forEach((ingredient, index) => {
        if (text.toLowerCase().includes(ingredient.toLowerCase())) {
            ingredientArray[index] = 1;
        }
    });
console.log(text + " ---- [" + ingredientArray + "]");
    return ingredientArray;
};