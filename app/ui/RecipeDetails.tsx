import { JSONObject } from "@/lib/definations";

export default function RecipeDetails({data}: {data: JSONObject}) {

    return (
        <>
            <h2 className="text-2xl">{data.name}</h2>

            <div className="text-xl">Ingredients</div>
            <ul>
                {data.ingredients.map((item: string, idx: number )=> (
                    <li key={`ingr_${idx}`}>{item}</li>
                ))}
            </ul>
            <div className="text-xl">Method</div>
            <div className="">{data.method}</div>
        </>
    )
}