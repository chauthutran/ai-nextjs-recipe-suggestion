"use server";

import connectToDatabase from "@/lib/mongodb/db";
import Recipe from "./schemas/Recipe.schema";
import cloudinary from "cloudinary";
import { JSONObject } from "../definations";
import mongoose, { mongo } from 'mongoose';
import Category from "./schemas/Category.schema";
import * as Utils from "@/lib/utils";
import User from "./schemas/User.schema";


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

export const getTopPicks = async (topN: number): Promise<JSONObject> => {
    try {
        const topPicks = await Recipe.aggregate([
            {
                $addFields: {
                    averageRating: {
                        $avg: "$ratings.rating", // Calculate the average rating
                    },
                },
            },
            {
                $sort: { averageRating: -1 }, // Sort by average rating in descending order
            },
            {
                $limit: topN, // Limit the result to top N recipes
            },
            {
                $lookup: {
                    from: "users", // Join with the 'users' collection to populate user details for ratings
                    localField: "ratings.user",
                    foreignField: "_id",
                    as: "ratingUsers", // Output as 'ratingUsers' array
                },
            },
            {
                $lookup: {
                    from: "categories", // Join with the 'categories' collection
                    localField: "categories", // Field in the 'recipes' collection that references categories
                    foreignField: "_id", // Field in the 'categories' collection
                    as: "categoryDetails", // Output populated category details
                },
            },
            {
                $project: {
                    name: 1,
                    ingredients: 1,
                    method: 1,
                    averageRating: 1,
                    categoryDetails: 1, // Include the populated categories
                    mealTypes: 1,
                    dietaryRestrictions: 1,
                    ratings: 1,
                    ratingUsers: 1, // Include the user details of those who rated
                },
            },
        ]);

        return {status: "success", data: Utils.cloneJSONObject(topPicks)};
    } catch (error) {
        return {status: "error", message: Utils.getResponseErrMessage(error)};
    }
};


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


// =====================================================================================================
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


export async function updateRatings() {
    try {
        await connectToDatabase();

		const userIds = await User.find({});
		const userIdList = userIds.map((user) => user._id);

		const recipes = await Recipe.find({});

		for( let i=0; i<recipes.length; i++ ) {
			const recipe = recipes[i];
			const userListNo = getRandomNumber(0,49);
			const userListIdexes: number[] = getRandomUniqueNumbers(0,49, userListNo );
// console.log("----userListNo", userListNo)
// console.log("userListIdexes", userListIdexes)
			const ratings: JSONObject[] = []; 
			for( var j=0; j<userListIdexes.length; j++ ) {
				const rating = getRandomNumber(1,5);
				const userId = userIdList[userListIdexes[j]];
				ratings.push({user: new mongoose.Types.ObjectId(userId), rating: rating});
				// console.log({user: new mongoose.Types.ObjectId(userId), rating: rating})
			}

			console.log("ratings", ratings);
			await Recipe.updateOne({ _id: recipe._id }, { ratings: ratings });
		}
		console.log("Uploaded Rating");
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

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUniqueNumbers(min: number, max: number, count: number): number[] {
    // Ensure count does not exceed the range
    if (count > (max - min + 1)) {
        throw new Error("Count exceeds the range of unique numbers available.");
    }

    // Create an array of numbers from min to max
    const numbers: number[] = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    // Shuffle the array using Fisher-Yates (Knuth) shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap
    }

    // Return the first 'count' numbers from the shuffled array
    return numbers.slice(0, count);
}