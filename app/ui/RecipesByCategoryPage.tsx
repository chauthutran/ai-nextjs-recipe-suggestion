import { JSONObject } from "@/lib/definations";
import CategoryFilter from "./layout/CategoryFilter";
import { useState } from "react";
import * as dbService from "@/lib/mongodb";
import { useCategory } from "@/contexts/CategoryContext";
import ReceipeList from "./recipeList/RecipeList";

export default function RecipesByCategoryPage() {
    
    const { categories } = useCategory();
    const [recipes, setRecipes] = useState<JSONObject[]>([]);
    const [errMsg, setErrMsg] = useState("");


    const fetchRecipes = async( filterCategories: JSONObject[] ) => {
        const filterCategoryIds = filterCategories.map(item => item._id);
        const response = await dbService.fetchRecipes(filterCategoryIds);
        if( response.status == "success" ) {
            setRecipes( response.data );
        }
        else {
            setErrMsg( response.message );
        }
    }

    if( categories === null ) return (<div>Loading ... </div>)

    return (
        <>
            <CategoryFilter categories={categories} onFilterChange={(filterCategories) => fetchRecipes(filterCategories) } />
            <ReceipeList data={recipes} />
        </>
    )
}