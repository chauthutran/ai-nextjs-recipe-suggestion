"use server";

import { unique } from "@tensorflow/tfjs";
import mongoose, { Schema } from "mongoose";

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    ingredients: { type: [String], required: true }, // Array of strings
    method: { type: [String], required: true }, // Array of strings
    createdAt: {type: Date, default: new Date()}
},
{
    timestamps: true,
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

export default Recipe;