"use client";

import Image from "next/image";
import { GiNoodles } from "react-icons/gi";

export default function Header() {

    return (
        <header className="font-montserrat px-10 flex items-center space-x-10 py-3 text-black">


            {/* <div className="flex-1 flex  items-center"> */}
            <div className="flex flex-col items-center justify-center text-leaf-green font-extrabold">
                <div className="text-2xl">
                    {/* <GiNoodles /> */}
                    <Image
                        src="/images/food-svgrepo-com.svg" // Path from the public folder
                        alt="Logo"
                        width={30} // Set width and height
                        height={100}
                    />
                </div>
                <div>AI Recipes</div>
            </div>

            <button>Home</button>
            <button>Meal Planner</button>
            <button>Favorites</button>
            <button>Categories</button>
            <button>Dietary Preferences</button>
            <button>Recipe Upload</button>
            <button>Profile</button>
            <button>Notifications</button>
            <button>About</button>
            <button className="bg-leaf-green px-3 py-1 text-white rounded-lg">Search</button>
            {/* <div>Ingredient-Based Recipe Suggestions</div>
                <div>Cuisine and Dietary Preferences</div>
                <div>Meal Planner</div>
                <div>Nutritional Information</div>
                <div>Recipe Search and Filters</div>
                <div>Favorites and Recipe Collections</div>
                <div>AI-Powered Recipe Suggestions</div>
                <div>User Reviews and Ratings</div>
                <div>Recipe Sharing</div>
                <div>Personalized Notifications</div> */}
            {/* </div> */}
            {/* <div className="ml-auto flex bg-black text-white px-3 py-1">fasd</div> */}
        </header>
    )
}