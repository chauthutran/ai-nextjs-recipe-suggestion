import { JSONObject } from "@/lib/definations";
import { useEffect, useState } from "react";
import * as dbService from "@/lib/mongodb";
import { useCategory } from "@/contexts/CategoryContext";
import RecipeList from "./recipe/RecipeList";
import { useApp } from "@/contexts/AppContext";
import CategoriesNavigation from "./homePage/CategoriesNavigation";

export default function RecipesByCategoryPage() {
    
    const { appPage } = useApp();
    const { categories } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState<JSONObject>({});
    const [recipes, setRecipes] = useState<JSONObject[]>([]);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const fetchRecipes = async( filterCategories: JSONObject[] ) => {
        setLoading(true);
        setSelectedCategory(filterCategories[0]);
        
        const filterCategoryIds = filterCategories.map(item => item._id);
        const response = await dbService.fetchRecipes(filterCategoryIds);
        if( response.status == "success" ) {
            setRecipes( response.data );
        }
        else {
            setErrMsg( response.message );
        }
        setLoading(false);
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

            {selectedCategory.name !== "" && <>
                <h2 className="text-2xl font-semibold border-b border-leaf-green w-fit pr-3 mt-10 mb-5 flex space-x-3 pb-2">
                    {selectedCategory.icon && <div dangerouslySetInnerHTML={{ __html: selectedCategory.icon.replace('<svg', '<svg width="32" height="32"'), }} />}
                    <div>Recipes of {selectedCategory.name}</div>
                </h2>
                {loading ? <div>Loading ...</div> : <RecipeList data={recipes} />}
                
            </>}
        </div>
    )
}