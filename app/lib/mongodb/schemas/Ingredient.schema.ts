"use server";

import mongoose, { Schema } from "mongoose";

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    index: { type: Number, required: true }
},
{
    timestamps: true,
});

const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);

export default Ingredient;