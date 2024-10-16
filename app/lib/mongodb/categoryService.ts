"use server";

import * as Utils from '@/lib/utils';
import connectToDatabase from "./db";
import Category from "./schemas/Category.schema";

export async function fetchCategories() {
    try {
        
        await connectToDatabase();
        const categories = await Category.find();
        
        return { status: "success", data: Utils.cloneJSONObject(categories)};
    } catch (error) {
        return { status: "error", data: Utils.getResponseErrMessage(error)};
    }
  }