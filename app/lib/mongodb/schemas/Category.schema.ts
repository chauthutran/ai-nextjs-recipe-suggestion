"use server";

import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
	{
        name: { type: String, required: true },
        description: { type: String, required: true },
		icon: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
	},
	{
		timestamps: true,
	}
);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
