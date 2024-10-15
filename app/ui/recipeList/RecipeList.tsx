import { JSONObject } from "@/lib/definations";
import RecipeDetails from "./RecipeDetails";

export default function ReceipeList({ data }: { data: JSONObject[] }) {

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.map((recipe) => (
                <RecipeDetails key={recipe._id} data={recipe} />
            ))}
        </div>
    )
}