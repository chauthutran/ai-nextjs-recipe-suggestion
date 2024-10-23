import { JSONObject } from "@/lib/definations";
import RecipeDetails from "./RecipeDetails";
import RecipeListItem from "./RecipeListItem";

export default function RecipeList({ data }: { data: JSONObject[] }) {

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-5">
            {data.map((recipe) => (
                <RecipeListItem key={recipe._id} data={recipe} />
            ))}
        </div>
    )
}