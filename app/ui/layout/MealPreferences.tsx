// components/MealPreferences.tsx
import { JSONObject } from '@/lib/definations';
import { useState } from 'react';

const MealPreferences = ({ onSubmit }: {onSubmit: (preferences: JSONObject) => void}) => {
    const [preferences, setPreferences] = useState({
        mealType: 'lunch',
        dietaryRestrictions: 'vegan',
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPreferences((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        onSubmit(preferences); // Pass preferences back to parent
    };

    return (
        <div>
            <h2>Meal Preferences:</h2>
            <label>
                Meal Type:
                <select name="mealType" value={preferences.mealType} onChange={handleChange}>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>
            </label>
            <label>
                Dietary Restrictions:
                <select
                    name="dietaryRestrictions"
                    value={preferences.dietaryRestrictions}
                    onChange={handleChange}
                >
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="gluten-free">Gluten Free</option>
                    <option value="none">None</option>
                </select>
            </label>
            <button onClick={handleSubmit}>Generate Meal Plan</button>
        </div>
    );
};

export default MealPreferences;
