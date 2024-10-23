import { JSONObject } from "@/lib/definations";
import RecipeRating from "../recipe/RecipeRatings";
import * as Utils from "@/lib/utils";

export default function RecipeActionBar({data}: {data: JSONObject}) {

    return (
        <>
            <RecipeRating rating={Utils.calculateAverageRating(data)} ratingUserNo={data.ratings.length} />
        </>
    )
}