import { JSONObject } from "@/lib/definations";

export default function RecipeDetails({ data }: { data: JSONObject }) {

    return (
        <div key={data._id} className="p-4 border-2 border-leaf-green rounded-md shadow-sm w-full">
            <h2 className="text-xl font-semibold">{data.name}</h2>
            <div className="mt-2">
                <strong>Ingredients:</strong>
                <ul className="list-disc pl-5">
                    {data.ingredients.map((ingredient: string, index: number) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            <div className="mt-2">
                <strong>Method:</strong>
                <ol className="list-decimal pl-5">
                    {data.method.map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </div>
            <p className="text-gray-500 text-sm mt-2">Created at: {new Date(data.
                createdAt).toLocaleString()}</p>
        </div>
    )
}