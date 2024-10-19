"use server";

import { unique } from "@tensorflow/tfjs";
import mongoose, { Schema } from "mongoose";

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    ingredients: { type: [String], required: true }, // Array of strings
    method: { type: [String], required: true }, // Array of strings
    imageUrl: { type: String },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }],
    mealTypes: {
        type: [String], // Changed to an array to allow multiple meal types
        enum: [], // Example meal types
        required: true
    },
    dietaryRestrictions: {
        type: [String], // Array for multiple dietary restrictions
        enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'], // Example restrictions
    },
    createdAt: {type: Date, default: new Date()}
},
{
    timestamps: true,
});

const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

export default Recipe;