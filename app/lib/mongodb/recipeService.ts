"use server";

import connectToDatabase from "@/lib/mongodb/db";
import Recipe from "./schemas/Recipe.schema";
import cloudinary from "cloudinary";
import { JSONObject } from "../definations";
import mongoose, { mongo } from 'mongoose';
import Category from "./schemas/Category.schema";
import * as Utils from "@/lib/utils";


// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });


cloudinary.v2.config({
	cloud_name: "dr533yqid",
    api_key: "344935136281222",
    api_secret: "bKE0gc2JcdvW1MTw9ndUzXPbIjw",
});

export async function fetchRecipes(categoryIds?: string[]): Promise<JSONObject> {
	try {
		await connectToDatabase();

		let recipes;
		if( categoryIds ) {
			const categorIdObjects = categoryIds.map((categoryId: string) => new mongoose.Types.ObjectId(categoryId));
			recipes = await Recipe.find({ categories: { $in: categorIdObjects } }).populate("categories");
		}
		else {
			recipes = await Recipe.find().populate("categories");
		}

		return { status: "success", data: Utils.cloneJSONObject(recipes) };
	} catch (error) {
		return { status: "error", message: Utils.getResponseErrMessage(error) };
	}
}


export async function createRecipe(payload: JSONObject) {
    try {
        await connectToDatabase();

        let imageUrl = "";

        // Upload image to Cloudinary if provided
		if (payload.imageFile) {
			try {
				const result = await cloudinary.v2.uploader.upload(
					payload.imageFile,
					{
						folder: "recipes",
					}
				);
				imageUrl = result.secure_url;

				
				const resultImg = {name: payload.name,imageUrl };
				console.log(JSON.stringify(resultImg));
			} catch (error) {
				console.error("Error uploading to Cloudinary:", error);
			}
		}

        return { status: "success" };
    } catch (error: any) {
        return { status: "error", message: error.message };
    }
}


// Change/update structure model

export async function updateMealTypes() {
    try {
        await connectToDatabase();

		const maplist: JSONObject[] = [
			{ "recipeName": "Beef Stir Fry", "mealTypes": ["lunch", "dinner"] },
		]
		  
		  
		
		for( let i=0; i<maplist.length; i++ ) {
				const mapData = maplist[i];
				const recipe = await Recipe.findOne({ name: mapData.recipeName.trim() });
				// console.log(recipe);
				if(recipe !== null ) {
					recipe.mealTypes = mapData.mealTypes;
					// const saved = await Recipe.updateOne({ _id: recipe._id }, { mealTypes: mapData.mealTypes });

					// console.log(mapData.mealTypes);
					// console.log(recipe);
					const result = await Recipe.updateOne({_id: recipe._id}, recipe, {new: true});

				console.log(result);	
				}
			}
		console.log("Uploaded mealTypes");
	} catch (error: any) {
        console.log("Uploaded ERROR",  error.message);
    }
}


export async function updateDietaryRestrictions() {
    try {
        await connectToDatabase();

		const maplist: JSONObject[] = [
			{
			  "name": "Chicken and Dumplings",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Roasted Vegetable Medley",
			  "dietaryRestrictions": ["Vegetarian", "Vegan", "Gluten-Free", "Nut-Free", "Dairy-Free"]
			},
			{
			  "name": "Grilled Chicken Salad",
			  "dietaryRestrictions": ["Gluten-Free"]
			},
			{
			  "name": "Cauliflower Buffalo Bites",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Peanut Butter Cookies",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free"]
			},
			{
			  "name": "Clam Chowder",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Pasta Salad",
			  "dietaryRestrictions": ["Vegetarian"]
			},
			{
			  "name": "Quiche Lorraine",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Asian Noodle Salad",
			  "dietaryRestrictions": ["Vegetarian", "Nut-Free"]
			},
			{
			  "name": "Tofu Stir Fry",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Baked Potatoes",
			  "dietaryRestrictions": ["Vegetarian", "Vegan", "Gluten-Free", "Nut-Free", "Dairy-Free"]
			},
			{
			  "name": "Coconut Rice",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free", "Dairy-Free"]
			},
			{
			  "name": "Stuffed Mushrooms",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Fettuccine Alfredo",
			  "dietaryRestrictions": ["Vegetarian"]
			},
			{
			  "name": "Egg Fried Rice",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Spinach and Cheese Omelette",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Avocado Toast",
			  "dietaryRestrictions": ["Vegetarian", "Vegan", "Nut-Free"]
			},
			{
			  "name": "Peanut Butter Oatmeal",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free"]
			},
			{
			  "name": "Garlic Butter Shrimp",
			  "dietaryRestrictions": ["Gluten-Free"]
			},
			{
			  "name": "Lentil and Spinach Soup",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Pancakes",
			  "dietaryRestrictions": ["Vegetarian", "Nut-Free"]
			},
			{
			  "name": "Mushroom Soup",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Spaghetti Bolognese",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Spinach and Feta Quesadillas",
			  "dietaryRestrictions": ["Vegetarian", "Nut-Free"]
			},
			{
			  "name": "Chicken Stir-Fry",
			  "dietaryRestrictions": ["Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Cheesy Mashed Potatoes",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Shrimp Scampi",
			  "dietaryRestrictions": ["Gluten-Free"]
			},
			{
			  "name": "Zucchini Fritters",
			  "dietaryRestrictions": ["Vegetarian", "Nut-Free"]
			},
			{
			  "name": "Chicken Noodle Soup",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Pasta Carbonara",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Sweet Potato Fries",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free", "Dairy-Free"]
			},
			{
			  "name": "Garlic Bread",
			  "dietaryRestrictions": ["Vegetarian", "Nut-Free"]
			},
			{
			  "name": "Omelette",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Dak Gomtang (Korean Chicken Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Kimchi Jjigae (Kimchi Stew with Pork or Tofu)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Galbitang (Beef Short Rib Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Sundubu Jjigae (Soft Tofu Stew)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Miyeok Guk (Seaweed Soup)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Doenjang Jjigae (Soybean Paste Stew)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Samgyetang (Ginseng Chicken Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Kimchi Guk (Kimchi Soup)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Kongnamul Guk (Soybean Sprout Soup)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Tteokguk (Rice Cake Soup)",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free"]
			},
			{
			  "name": "Mandu Guk (Korean Dumpling Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Yukgaejang (Spicy Beef Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Dwaeji Gukbap (Pork Soup with Rice)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Seolleongtang (Ox Bone Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Hobakjuk (Pumpkin Porridge)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Janchi Guksu (Banquet Noodle Soup)",
			  "dietaryRestrictions": ["Vegetarian", "Nut-Free"]
			},
			{
			  "name": "Maeuntang (Spicy Fish Stew)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Sujebi (Hand-Pulled Dough Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Gyeran Guk (Egg Soup)",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Bukeoguk (Dried Pollock Soup)",
			  "dietaryRestrictions": ["Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Yeolmu Kimchi Guk (Young Radish Kimchi Soup)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Nureun Deulkkae Tang (Perilla Seed Soup)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Kalguksu (Knife-Cut Noodle Soup)",
			  "dietaryRestrictions": ["Vegetarian"]
			},
			{
			  "name": "Jjampong (Spicy Seafood Noodle Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Oritang (Duck Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Hwangtae Guk (Dried Pollock Soup)",
			  "dietaryRestrictions": ["Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Chueotang (Loach Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Gochujang Jjigae (Spicy Red Pepper Stew)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Bulgogi Jeongol (Bulgogi Hot Pot)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Gamjatang (Pork Bone Soup)",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Miyeokguk (Seaweed Soup)",
			  "dietaryRestrictions": ["Vegan", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Korean Spicy Chicken Salad",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Bibim Noodles",
			  "dietaryRestrictions": ["Vegan", "Nut-Free"]
			},
			{
			  "name": "Kimchi Pancake",
			  "dietaryRestrictions": ["Vegan", "Nut-Free"]
			},
			{
			  "name": "Kimchi Fried Rice",
			  "dietaryRestrictions": ["Vegetarian", "Gluten-Free", "Nut-Free"]
			},
			{
			  "name": "Tuna Kimbap",
			  "dietaryRestrictions": []
			},
			{
			  "name": "Vegetable Kimbap",
			  "dietaryRestrictions": ["Vegan", "Nut-Free"]
			}
		  ]
		  
		  
		
		for( let i=0; i<maplist.length; i++ ) {
				const mapData = maplist[i];
				const recipe = await Recipe.findOne({ name: mapData.name.trim() });
				// console.log(recipe);
				if(recipe !== null ) {
					recipe.dietaryRestrictions = mapData.dietaryRestrictions;
					// const saved = await Recipe.updateOne({ _id: recipe._id }, { mealTypes: mapData.mealTypes });

					// console.log(mapData.mealTypes);
					// console.log(recipe);
					const result = await Recipe.updateOne({_id: recipe._id}, recipe, {new: true});

				// console.log(result);	
				}
			}
		console.log("Uploaded mealTypes");
	} catch (error: any) {
        console.log("Uploaded ERROR",  error.message);
    }
}

export async function updateImages() {
    try {
        await connectToDatabase();

		const imageList = 
		[{"name":"Roasted Cauliflower","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148215/recipes/gkedoigbzkhis3cmzj8o.jpg"},
		{"name":"Greek Salad","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148236/recipes/qbsul7q3tduw5vtc0bjk.jpg"},
		{"name":"Lentil Salad","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148243/recipes/ezpa1qp8w6stpureyqnq.jpg"},
		{"name":"Chicken and Rice Casserole","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148250/recipes/azp2vk3khdspeeaoual7.jpg"},
		{"name":"Vegetable Stir Fry","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148258/recipes/imvmlen29rggnusjffp0.jpg"},
		{"name":"Quiche Lorraine","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148263/recipes/gupppeyhuy1r5fmbbzdr.jpg"},
		{"name":"Beef and Broccoli Stir-Fry","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148270/recipes/g8vxvfotw0wkd2nrsuna.jpg"},
		{"name":"Roasted Bell Pepper Soup","imageUrl":"https://res.cloudinary.com/dr533yqid/image/upload/v1729148276/recipes/jddvq2zgikkb81kb3vxe.jpg"}];
			for( let i=0; i<imageList.length; i++ ) {
				const imgData = imageList[i];
				const recipe = await Recipe.findOne({ name: imgData.name.trim() });
				// console.log(recipe);
				if(recipe !== null ) {
					recipe.imageUrl = imgData.imageUrl.trim();
					const saved = await Recipe.updateOne({ _id: recipe._id }, { imageUrl: imgData.imageUrl.trim() });
					
				}
			}
		console.log("Uploaded images");
	} catch (error: any) {
        console.log("Uploaded ERROR",  error.message);
    }
}



export async function getRecipesWithoutCategories() {
    try {
        await connectToDatabase();
	const recipesWithoutCategories = await Recipe.find({ "categories": { "$exists": false } });
	console.log(recipesWithoutCategories.map(item => item.name).join(" ,"));
		
	} catch (error: any) {
	console.log("Uploaded ERROR",  error.message);
}

}


export async function updateCategories() {
	const mapList =[
		{ "recipe": "Beef Stir Fry", "categories": ["Curry"] },
		{ "recipe": "Spinach and Mushroom Quesadilla", "categories": ["Vegetarian", "Mexican"] },
		{ "recipe": "Chicken Quinoa Bowl", "categories": ["Salads", "Rice Dishes"] },
		{ "recipe": "Vegetable Quesadilla", "categories": ["Vegetarian", "Mexican"] },
		{ "recipe": "Chicken Tikka Masala", "categories": ["Curry"] },
		{ "recipe": "Roasted Cauliflower", "categories": ["Vegetarian"] },
		{ "recipe": "Stuffed Peppers", "categories": ["Vegetarian"] },
		{ "recipe": "Cauliflower Rice", "categories": ["Rice Dishes", "Vegetarian"] },
		{ "recipe": "Turkey Meatballs", "categories": ["Baked Dishes"] },
		{ "recipe": "Chicken Enchiladas", "categories": ["Mexican"] },
		{ "recipe": "Black Bean Soup", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "Eggplant Parmesan", "categories": ["Vegetarian", "Baked Dishes"] },
		{ "recipe": "Mushroom Stroganoff", "categories": ["Vegetarian", "Pasta"] },
		{ "recipe": "Stuffed Zucchini", "categories": ["Vegetarian"] },
		{ "recipe": "Thai Chicken Curry", "categories": ["Curry"] },
		{ "recipe": "Vegetable Stir Fry", "categories": ["Vegetarian", "Curry"] },
		{ "recipe": "Salmon Fillet with Asparagus", "categories": ["Seafood"] },
		{ "recipe": "BBQ Chicken Pizza", "categories": ["Baked Dishes"] },
		{ "recipe": "Chicken Pot Pie", "categories": ["Baked Dishes"] },
		{ "recipe": "Roasted Brussels Sprouts", "categories": ["Vegetarian"] },
		{ "recipe": "Macaroni and Cheese", "categories": ["Pasta", "Baked Dishes"] },
		{ "recipe": "Chicken Fajitas", "categories": ["Mexican"] },
		{ "recipe": "Beef Tacos", "categories": ["Mexican"] },
		{ "recipe": "Shrimp Tacos", "categories": ["Mexican", "Seafood"] },
		{ "recipe": "Ratatouille", "categories": ["Vegetarian"] },
		{ "recipe": "Chicken and Broccoli Stir Fry", "categories": ["Curry"] },
		{ "recipe": "Baked Salmon with Lemon", "categories": ["Seafood"] },
		{ "recipe": "Stuffed Bell Peppers", "categories": ["Vegetarian"] },
		{ "recipe": "Teriyaki Chicken", "categories": ["Curry"] },
		{ "recipe": "Grilled Shrimp Skewers", "categories": ["Seafood"] },
		{ "recipe": "Chocolate Chip Cookies", "categories": ["Baked Dishes"] },
		{ "recipe": "Banana Bread", "categories": ["Baked Dishes"] },
		{ "recipe": "Chilli Con Carne", "categories": ["Mexican"] },
		{ "recipe": "Beef and Broccoli Stir Fry", "categories": ["Curry"] },
		{ "recipe": "Corn Salad", "categories": ["Salads", "Vegetarian"] },
		{ "recipe": "Chicken Shawarma", "categories": ["Mexican"] },
		{ "recipe": "Garlic Mashed Potatoes", "categories": ["Baked Dishes"] },
		{ "recipe": "Lemon Garlic Chicken", "categories": ["Chicken"] },
		{ "recipe": "Vegetarian Chili", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "Thai Green Curry", "categories": ["Curry"] },
		{ "recipe": "Buffalo Cauliflower Wings", "categories": ["Vegetarian"] },
		{ "recipe": "Cabbage Rolls", "categories": ["Vegetarian"] },
		{ "recipe": "Chicken and Dumplings", "categories": ["Soups"] },
		{ "recipe": "Roasted Vegetable Medley", "categories": ["Vegetarian"] },
		{ "recipe": "Cauliflower Buffalo Bites", "categories": ["Vegetarian"] },
		{ "recipe": "Peanut Butter Cookies", "categories": ["Baked Dishes"] },
		{ "recipe": "Pasta Salad", "categories": ["Salads", "Pasta"] },
		{ "recipe": "Quiche Lorraine", "categories": ["Baked Dishes"] },
		{ "recipe": "Tofu Stir Fry", "categories": ["Vegetarian", "Curry"] },
		{ "recipe": "Baked Potatoes", "categories": ["Baked Dishes"] },
		{ "recipe": "Stuffed Mushrooms", "categories": ["Vegetarian"] },
		{ "recipe": "Chicken Burrito", "categories": ["Mexican"] },
		{ "recipe": "Ratatouille Casserole", "categories": ["Vegetarian", "Baked Dishes"] },
		{ "recipe": "Veggie Tacos", "categories": ["Vegetarian", "Mexican"] },
		{ "recipe": "Chocolate Mousse", "categories": ["Baked Dishes"] },
		{ "recipe": "Beef and Broccoli Stir-Fry", "categories": ["Curry"] },
		{ "recipe": "Tomato Basil Soup", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "Spinach and Mushroom Stir-Fry", "categories": ["Vegetarian"] },
		{ "recipe": "Vegetable Stir-Fry", "categories": ["Vegetarian"] },
		{ "recipe": "Honey Garlic Chicken", "categories": ["Chicken"] },
		{ "recipe": "Basil Pesto Pasta", "categories": ["Pasta"] },
		{ "recipe": "Cheesy Garlic Bread", "categories": ["Baked Dishes"] },
		{ "recipe": "Stuffed Bell Peppers", "categories": ["Vegetarian"] },
		{ "recipe": "Spinach and Cheese Omelette", "categories": ["Vegetarian"] },
		{ "recipe": "Mushroom Risotto", "categories": ["Pasta", "Vegetarian"] },
		{ "recipe": "Chicken Tacos", "categories": ["Mexican"] },
		{ "recipe": "Grilled Chicken Caesar Salad", "categories": ["Salads", "Chicken"] },
		{ "recipe": "Fish Tacos", "categories": ["Seafood", "Mexican"] },
		{ "recipe": "Chicken Fajitas", "categories": ["Mexican"] },
		{ "recipe": "Stuffed Zucchini Boats", "categories": ["Vegetarian"] },
		{ "recipe": "Pasta Primavera", "categories": ["Pasta"] },
		{ "recipe": "Coconut Curry Shrimp", "categories": ["Curry", "Seafood"] },
		{ "recipe": "Vegetable Curry", "categories": ["Curry", "Vegetarian"] },
		{ "recipe": "Chicken Alfredo", "categories": ["Pasta"] },
		{ "recipe": "Garlic Butter Shrimp", "categories": ["Seafood"] },
		{ "recipe": "Lentil and Spinach Soup", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "Grilled Cheese Sandwich", "categories": ["Sandwiches"] },
		{ "recipe": "Tuna Salad", "categories": ["Salads"] },
		{ "recipe": "Pancakes", "categories": ["Breakfast"] },
		{ "recipe": "Greek Salad", "categories": ["Salads"] },
		{ "recipe": "Vegetarian Chili", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "BBQ Chicken Pizza", "categories": ["Baked Dishes", "Mexican"] },
		{ "recipe": "Egg Fried Rice", "categories": ["Rice Dishes"] },
		{ "recipe": "Tomato Basil Soup", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "Stuffed Bell Peppers", "categories": ["Vegetarian"] },
		{ "recipe": "Spinach and Feta Quesadillas", "categories": ["Vegetarian", "Mexican"] },
		{ "recipe": "Chicken Stir-Fry", "categories": ["Curry"] },
		{ "recipe": "Cheesy Mashed Potatoes", "categories": ["Baked Dishes"] },
		{ "recipe": "Shrimp Scampi", "categories": ["Seafood", "Pasta"] },
		{ "recipe": "Zucchini Fritters", "categories": ["Vegetarian"] },
		{ "recipe": "Vegetable Stir-Fry", "categories": ["Vegetarian"] },
		{ "recipe": "Beef Tacos", "categories": ["Mexican"] },
		{ "recipe": "Grilled Shrimp Skewers", "categories": ["Seafood"] },
		{ "recipe": "Sweet Potato Fries", "categories": ["Vegetarian"] },
		{ "recipe": "Caprese Salad", "categories": ["Salads", "Vegetarian"] },
		{ "recipe": "Garlic Bread", "categories": ["Baked Dishes"] },
		{ "recipe": "Omelette", "categories": ["Breakfast"] },
		{ "recipe": "Vegetable Soup", "categories": ["Soups", "Vegetarian"] },
		{ "recipe": "Chicken and Rice Casserole", "categories": ["Rice Dishes"] }
	  ];
	  
	  
	const categories = await Category.find();
	const recipes = await Recipe.find();

	for( var i=0; i<mapList.length; i++ ) {
		const data = mapList[i];
		const recipeName = data.recipe;
		const categoryNames = data.categories;
		
		const recipeData = Utils.findItemFromList(recipes, recipeName, "name");
		if( recipeData !== null ) {
			let recipeCategoryList = categories.filter(item => categoryNames.includes(item.name));
			let recipeCategoryIdList = recipeCategoryList.map(item => new mongoose.Types.ObjectId(item._id));

		


			if( recipeCategoryIdList.length > 0  ) {
				recipeData.categories = recipeCategoryIdList;
				const result = await Recipe.updateOne({_id: recipeData._id}, recipeData, {new: true});
				// if( recipeName === "Tomato Basil Soup" ) {
				// 	console.log("====== " + recipeName);
				// 	console.log("------ " + recipeCategoryIdList);
				// 	console.log("------ " + recipeData);
				// }
				
				// console.log(result);
			}
			else {
				console.log(data);
			}
		}
		else {
			console.log(data);
		}
	}
}