"use server";

import connectToDatabase from "@/lib/mongodb/db";
import Recipe from "./schemas/Recipe.schema";
import * as Utils from "@/lib/utils";
import cloudinary from "cloudinary";
import { JSONObject } from "../definations";
import mongoose from 'mongoose';

cloudinary.v2.config({
    cloud_name: 'dr533yqid',
    api_key: '344935136281222',
    api_secret: `bKE0gc2JcdvW1MTw9ndUzXPbIjw`,
});

export async function fetchRecipes() {
	try {
		await connectToDatabase();

		const recipes = await Recipe.find();

		return { status: "success", data: Utils.cloneJSONObject(recipes) };
	} catch (error) {
		return { status: "error", data: Utils.getResponseErrMessage(error) };
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
				console.log(payload.name + " --- " + imageUrl);
			} catch (error) {
				console.error("Error uploading to Cloudinary:", error);
			}
		}

        return { status: "success" };
    } catch (error: any) {
        return { status: "error", message: error.message };
    }
}


export async function updateImages() {
    try {
        await connectToDatabase();

		const imageList = [{"name": "Chicken Stew", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729005878/recipes/paxx1zo6s6e0vvgwnycu.jpg"},
			{"name": "Beef Stir Fry", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006037/recipes/gat5qju1gkfsscvllldo.jpg"},
			{"name": "Spinach and Mushroom Quesadilla", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006157/recipes/raonbqo5e8nmnsxq9tp9.jpg"},
			{"name": "Vegetable Soup", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006124/recipes/qptbkjtmaz8iclwngruj.jpg"},
			{"name": "Chicken Quinoa Bowl", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006194/recipes/ukstqmkelox4exydj5dh.jpg"},
			{"name": "Grilled Cheese Sandwich", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006235/recipes/rxbun2sdrepkzhl2q03q.jpg"},
			{"name": "Vegetable Quesadilla", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006263/recipes/c47qt38au2awrpmrbbwu.jpg"},
			{"name": "Creamy Mushroom Risotto", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/bngvwmlw5tgz5zve02go.jpg"},
			{"name": "Chicken Tikka Masala", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/paxx1zo6s6e0vvgwnycu"},
			{"name": "Roast cauli flower", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/iqe23heugqjmoloocijk"},
			{"name": "Stuffed Peppers", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/nlwfxtdarplumfnjmkxa"},
			{"name": "Cauliflower Rice", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/umbeyggihwalybzhbvar"},
			{"name": "Turkey Meatballs", "url": "https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/k6pbas1nbd9x8jojqche"},
			{"name": "Chicken Enchiladas", "url": "	https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/nneyulqxzd4nhu9itdft"},
			{"name": "Baked Ziti", "url": "	https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/tugsuqgpbjvcnuqszndo"},
			{"name": "Black Bean Soup", "url": "	https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/hbrn415qcivickjwqgq1"},
			{"name": "Quinoa Salad", "url": "	https://res.cloudinary.com/dr533yqid/image/upload/v1729006295/recipes/iujscgenomw716vlj2ee"}]
		
			

			for( let i=0; i<imageList.length; i++ ) {
				const imgData = imageList[i];
				const recipe = await Recipe.findOne({ name: imgData.name.trim() });
				// console.log(recipe);
				if(recipe !== null ) {
					recipe.imageUrl = imgData.url.trim();
					const saved = await Recipe.updateOne({ _id: recipe._id }, { imageUrl: imgData.url.trim() });
					// console.log(saved);
				}
			}
		console.log("Uploaded images");
	} catch (error: any) {
        console.log("Uploaded ERROR",  error.message);
    }
}
	