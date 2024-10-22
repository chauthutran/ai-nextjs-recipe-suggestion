import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as dbService from "@/lib/mongodb";
import { useCategory } from "@/contexts/CategoryContext";
import ReceipeList from "./recipeList/RecipeList";
import { useApp } from "@/contexts/AppContext";
import CategoriesNavigation from "./homePage/CategoriesNavigation";

export default function RecipesByCategoryPage() {
    
    const { appPage } = useApp();
    const { categories } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState<JSONObject>({});
    const [recipes, setRecipes] = useState<JSONObject[]>([]);
    const [errMsg, setErrMsg] = useState("");

    const fetchRecipes = async( filterCategories: JSONObject[] ) => {
        const filterCategoryIds = filterCategories.map(item => item._id);
        const response = await dbService.fetchRecipes(filterCategoryIds);
        if( response.status == "success" ) {
            setSelectedCategory(filterCategories[0]);
            setRecipes( response.data );
        }
        else {
            setErrMsg( response.message );
        }
    }

    useEffect(() => {
        if( appPage.data !== null ) {
            fetchRecipes([appPage.data]);
        }
    }, []);


    if( categories === null ) return (<div>Loading ... </div>)

    return (
        <div className="mx-5 mb-8">
            <h2 className="text-2xl font-semibold border-b border-leaf-green w-fit pr-3 mb-5">Categories Navivation</h2>

            <div className="px-3">
                <CategoriesNavigation handleItemOnClick={(category) => fetchRecipes([category])} />
            </div>

            {recipes.length > 0 && <>
                <h2 className="text-2xl font-semibold border-b border-leaf-green w-fit pr-3 mt-10 mb-5">Recipes of {selectedCategory.name}</h2>
                <ReceipeList data={recipes} />
            </>}
        </div>
    )
}