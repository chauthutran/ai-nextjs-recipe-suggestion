"use server";

import mongoose, { Schema } from "mongoose";

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: [String], required: true }, // Array of strings
    method: { type: [String], required: true }, // Array of strings
    ingredientData: { type: [Number] }, // Array of numbers
},
{
    timestamps: true,
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

export default Recipe;