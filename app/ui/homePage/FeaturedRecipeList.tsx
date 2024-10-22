"use client";

import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as dbService from "@/lib/mongodb";
import Image from "next/image";

export default function FeaturedRecipeList() {
    const [featuredRecipes, setFeaturedRecipes] = useState<JSONObject>([]);
    const [errMsg, setErrMsg] = useState("");

    const getTopPicks = async () => {
        const response: JSONObject = await dbService.getTopPicks(3);
        if (response.status === "success") {
            setFeaturedRecipes(response.data);
            setErrMsg("");
        }
        else {
            setErrMsg(response.message);
        }
    }

    useEffect(() => {
        getTopPicks();
    }, []);


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {errMsg !== "" && <p>{errMsg}</p>}
            {featuredRecipes.map((recipe: JSONObject) => (
                <div key={recipe._id} className="bg-white p-4 rounded shadow">
                    {recipe.imageUrl ? <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        width={300}
                        height={200}
                        className="rounded mb-4"
                    />
                        : <Image
                            src="/images/default-recipe-image.png" // Path from the public folder
                            alt="default-recipe-image"
                            width={300} // Set width and height
                            height={100}
                        />}

                    <h3 className="text-xl font-bold">{recipe.name}</h3>
                    <p className="text-gray-500 text-sm mt-2">Created at: {new Date(recipe.
                        createdAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    )
}