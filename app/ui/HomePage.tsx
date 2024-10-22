"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import * as Constant from "@/lib/constant";
import * as dbService from "@/lib/mongodb";
import { JSONObject } from '@/lib/definations';


export default function HomePage() {
    const { appPage, setAppPage } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredRecipes, setFeaturedRecipes] = useState<JSONObject>([]);
    const [errMsg, setErrMsg] = useState("");

    const getTopPicks = async() => {        
        console.log("======== getTopPicks");

        const response: JSONObject = await dbService.getTopPicks(3);
        console.log(response);
        if( response.status === "success" ) {
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchQuery);
        setAppPage(Constant.PAGE_INGREDIENT_BASED_RECIPE_SUGGESTIONS, {query: searchQuery});
    };

    // const featuredRecipes = [
    //     {
    //         id: 1,
    //         title: 'Vegetable Stir Fry',
    //         image: '/images/stir-fry.jpg',
    //         description: 'A quick and healthy vegetable stir fry recipe.',
    //     },
    //     {
    //         id: 2,
    //         title: 'Creamy Tomato Soup',
    //         image: '/images/tomato-soup.jpg',
    //         description: 'A comforting tomato soup perfect for chilly days.',
    //     },
    //     {
    //         id: 3,
    //         title: 'Chicken Curry',
    //         image: '/images/chicken-curry.jpg',
    //         description: 'A delicious chicken curry with a blend of spices.',
    //     },
    // ];

    return (
        <div className="flex flex-col pl-5">
          
            <main className="flex-grow">
                <div className="space-y-1 mb-6 text-leaf-green">
                    <div className="text-xl font-semibold">Discover Delicious Recipes with AI</div>
                    <div>Get personalized meal suggestions based on your ingredients and dietary preferences</div>
                </div>


                <div className="mb-8">
                    <h2 className="text-2xl font-semibold">Find Your Perfect Recipe</h2>
                    <form onSubmit={handleSearch} className="flex mt-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for recipes..."
                            className="p-2 w-full border border-gray-300 rounded"
                        />
                        <button type="submit" className="ml-2 bg-blue-600 text-white px-4 rounded">
                            Search
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
                    {errMsg !== "" && <p>{errMsg}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                /> }

                                <h3 className="text-xl font-bold">{recipe.name}</h3>
                                <p className="text-gray-500 text-sm mt-2">Created at: {new Date(recipe.
                createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
