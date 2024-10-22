"use client";

import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import * as Constant from "@/lib/constant";


export default function FindRecipes () {

    const { setAppPage } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchQuery);
        setAppPage(Constant.PAGE_INGREDIENT_BASED_RECIPE_SUGGESTIONS, {query: searchQuery});
    };

    return (
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
    )
}