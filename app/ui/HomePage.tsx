"use client";

import React, { useEffect } from 'react';
import CategoriesNavigation from './homePage/CategoriesNavigation';
import FindRecipes from './homePage/FindRecipes';
import FeaturedRecipeList from './homePage/FeaturedRecipeList';


export default function HomePage() {

    return (
        <div className="flex flex-col pl-5">

            <main className="flex-grow">
                <div className="space-y-1 mb-6 text-leaf-green">
                    <div className="text-xl font-semibold">Discover Delicious Recipes with AI</div>
                    <div>Get personalized meal suggestions based on your ingredients and dietary preferences</div>
                </div>


                <div className="mb-8">
                    <h2 className="text-2xl font-semibold">Find Your Perfect Recipe</h2>
                    <FindRecipes />
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Featured Recipes</h2>
                    <FeaturedRecipeList />

                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold">Categories Navivation</h2>
                    <CategoriesNavigation />
                </div>

            </main>
        </div>
    );
};
