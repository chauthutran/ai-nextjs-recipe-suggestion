import { JSONObject } from '@/lib/definations';
import { useState } from 'react';
import * as Utils from "@/lib/utils";


interface CategoryFilterProps {
    categories: JSONObject[];
    onFilterChange: (selectedCategories: JSONObject[]) => void;
}


export default function CategoryFilter ({ categories, onFilterChange }: CategoryFilterProps) {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    const handleCategoryChange = (category: JSONObject) => {
        const updatedCategoryIds = selectedCategoryIds.includes(category._id)
            ? selectedCategoryIds.filter((catId) => catId !== category._id)
            : [...selectedCategoryIds, category._id];

            setSelectedCategoryIds(updatedCategoryIds);

        let updateCategories: JSONObject[] = [];
        if(updatedCategoryIds.length >0 ) {
            updateCategories = updatedCategoryIds.map(id => Utils.findItemFromList(categories, id, "_id")!);
        }
        onFilterChange(updateCategories); // Send selected categories back to the parent component
    };

    return (
        <div>
            <h3>Filter by Category</h3>
            <ul className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <li key={category.name}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedCategoryIds.includes(category.name)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            {category.name}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

