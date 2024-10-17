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


export async function importIngredients() {
    try {
        
        const arr = ["Apple","Avocado","Balsamic Vinegar","Banana","Basil","Bean","Beef","Beets","Bell Pepper","Black Beans","Black Pepper","Bread","Broccoli","Butter","Butternut Squash","Carrot","Cheese","Chicken","Chickpeas","Chili Powder","Cilantro","Coconut Milk","Corn","Crouton","Cucumber","Curry Powder","Dark Chocolate","Dill","Dried Pollock","Dried Seaweed","Eggs","Falafel","Fish","Flour","Garlic","Ginger","Gochujang","Grapes","Ham","Herbs","Honey","Hummus","Kidney Beans","Kimchi","Lemon","Lemon Juice","Lentil","Lentils","Lettuce","Maple Syrup","Marinara Sauce","Mayonnaise","Mozzarella Cheese","Mushroom","Mustard","Noodle","Noodles","Nori","Oats","Olive Oil","Onion","Orange","Oregano","Paprika","Parmesan","Parsley","Pasta","Peanut Butter","Perilla Powder","Pie Crust","Pine Nuts","Pita Bread","Pork","Potato","Quinoa","Red Pepper Paste","Rice","Salsa","Sesame Oil","Shrimp","Silken Tofu","Soy Sauce","Soybean Paste","Soybean Sprouts","Spinach","Squid","Sushi Rice","Sweet Potato","Taco Shells","Tahini","Tahini Sauce","Thyme","Tofu","Tomato","Tortilla","Tuna","Vanilla Extract","Vegetable Broth","Vegetable Stock","White Wine","Yogurt","Zucchini"];

        await connectToDatabase();
        for( var i=0; i<arr.length; i++ ) {
            await Ingredient.create({name: arr[i], index: i});
        }
        console.log("Import ingredients successfully !");
        
        // return { status: "success", data: Utils.cloneJSONObject(ingredients)};
    } catch (error) {
        console.log( Utils.getResponseErrMessage(error));
    }
}
