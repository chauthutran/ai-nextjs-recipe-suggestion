import { JSONObject } from "@/lib/definations";
import Image from "next/image";

export default function RecipeDetails({ data }: { data: JSONObject }) {

    return (
        <div key={data._id} className="p-4 border-2 border-leaf-green rounded-md shadow-sm w-full space-y-3">
            <h2 className="text-xl font-semibold">{data.name}</h2>
            {data.imageUrl && <Image
                src={data.imageUrl} // Path from the public folder
                alt="Logo"
                width={300} // Set width and height
                height={500}
            />}
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