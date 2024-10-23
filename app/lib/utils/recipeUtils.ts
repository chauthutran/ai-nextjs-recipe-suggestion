import { JSONObject } from "../definations";

export const calculateAverageRating = ( recipe: JSONObject): number => {
    
    if (recipe.ratings === undefined && recipe.ratings.length === 0) return 0; // If there are no ratings, return 0
  
    const total = recipe.ratings.reduce((sum: number, item: JSONObject) => sum + item.rating, 0); // Sum of all ratings
    return parseFloat((total / recipe.ratings.length).toFixed(1)); // Calculate average and round to 1 decimal place
   
}