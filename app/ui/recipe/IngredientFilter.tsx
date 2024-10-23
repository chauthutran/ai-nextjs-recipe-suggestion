import { useApp } from "@/contexts/AppContext"
import { useState } from "react";

export default function IngredientFilter({onFilterChange}: {onFilterChange: (selectedIngredients: string[]) => void}) {

    const { ingredients } = useApp();
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

    const handleIngredientChange = (ingredient: string) => {
        const updatedIngredient = selectedIngredients.includes(ingredient)
            ? selectedIngredients.filter((name) => name !== ingredient)
            : [...selectedIngredients, ingredient];

            setSelectedIngredients(updatedIngredient);

        onFilterChange(updatedIngredient);
    };

    if( ingredients === null ) return (<div>Loading ...</div>);

    return (
        <div>
        <h3>Filter by Ingredients</h3>
        <ul className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
                <li key={ingredient}>
                    <label>
                        <input
                            type="checkbox"
                            // checked={selectedCategoryIds.includes(ingredient)}
                            // onChange={() => handleCategoryChange(ingredient)}
                        />
                        {ingredient}
                    </label>
                </li>
            ))}
        </ul>
    </div>
    )
}