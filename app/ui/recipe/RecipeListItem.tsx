"use client";


import { JSONObject } from "@/lib/definations";
import { useState } from 'react';
import Image from "next/image";
import RecipeDetails from "./RecipeDetails";


export default function RecipeListItem({data}: {data: JSONObject}) {

    const [ showDetails, setShowDetails] = useState(false);
    const categoryNames = data.categories.map((item: JSONObject) => item.name);

    return (
        <>
             {!showDetails && <div key={data._id} className="p-4 border-2 border-leaf-green rounded-md shadow-sm w-full h-full flex flex-col justify-between space-y-3" onClick={() => setShowDetails(true) }>
                {data.imageUrl ? <Image
                        src={data.imageUrl} // Path from the public folder
                        layout="responsive"
                        alt="Logo"
                        width={200} // Set width and height
                        height={100}
                        // className="w-full"
                        // objectFit="contain" // "cover", "contain", "scale-down", "none" // Ensure the image covers the entire area
                    />
                : <Image
                    src="/images/default-recipe-image.png" // Path from the public folder
                    alt="default-recipe-image"
                    width={300} // Set width and height
                    height={100}
                />}
                <div className="mt-auto my-2 space-y-1">
                    <h2 className="text-xl font-semibold">{data.name}</h2>
                    <p className="text-sm bottom-0">Categories : {categoryNames.join(", ")}</p>
                    <p className="text-sm bottom-0">dietaryRestrictions : {data.dietaryRestrictions.join(", ")}</p>
                    <p className="text-gray-500 text-sm bottom-0">Created at: {new Date(data.
                        createdAt).toLocaleString()}</p>
                    <div className="pt-2">
                        <button className="bg-leaf-green px-4 py-1 text-white font-semibold rounded">See Details </button>
                    </div>
                </div>
            </div>}

            {showDetails && <RecipeDetails data={data} />}
        </>
    )
}