import { JSONObject } from "./definations";

export const cloneJSONObject = ( obj: JSONObject | JSONObject[]) => {
    return JSON.parse(JSON.stringify(obj));
}

export const getResponseErrMessage = (ex: any) => {
    if (ex instanceof Error) {
        return `An error occurred: ${ex.message}`;
    }
    else if (ex.name === 'AbortError') {
        console.error('Fetch request timed out');
    }
    
    return `An unexpected error occurred: ${ex}`;
}

/** 
 * Relate to Searching/Replace data in a list
 *  */ 

export const findItemFromList = ( list: JSONObject[], value: any, propertyName: string ) =>
{
    let item = null as JSONObject | null;

    if( list )
    {
        // If propertyName being compare to has not been passed, set it as 'id'.
        if ( propertyName === undefined )
        {
            propertyName = "id";
        }

        for( let i = 0; i < list.length; i++ )
        {
            let listItem = list[i];

            if ( listItem[propertyName] == value )
            {
                item = listItem;
                break;
            }
        }
    }

    return item;
}

export const parseIngredients = (ingredients: string[], text: string) => {
    // Basic keyword-based parsing (expand this list as needed)

    // Initialize an array of 10 ingredients (all 0 by default)
    const ingredientArray = Array(ingredients!.length).fill(0);

    // Check if the text contains any known ingredient and mark it as "1" in the array
    ingredients!.forEach((ingredient: string, index: number) => {
        if (text.toLowerCase().includes(ingredient.toLowerCase())) {
            ingredientArray[index] = 1;
        }
    });

    return ingredientArray;
};


export const convertIngredientsToFeatures = (
    inputText: string,
    ingredients: string[],
    categories: string[],
	mealTypes: string[],
	dietaryRestrictions: string[]
): JSONObject => {
    // Step 1: Normalize text to lowercase
    const normalizedText = inputText.toLowerCase();
    
    // // Step 2: Create ingredient and category index maps
    // const ingredientIndex: { [key: string]: number } = {};
    // ingredients.forEach((ingredient, index) => {
    //     ingredientIndex[ingredient] = index;
    // });

    // const categoryIndex: { [key: string]: number } = {};
    // categories.forEach((category, index) => {
    //     categoryIndex[category] = index;
    // });

    // const mealTypeIndex: { [key: string]: number } = {};
    // mealTypes.forEach((mealType, index) => {
    //     mealTypeIndex[mealType] = index;
    // });

    // // dietaryRestrictions ==> [breakfast: 0, lunch: 1, dinner: 2, snack: 3]
    // const dietaryRestrictionIndex: { [key: string]: number } = {};
    // dietaryRestrictions.forEach((restriction, index) => {
    //     dietaryRestrictionIndex[restriction] = index;
    // });

    // Step 3: Generate one-hot vector for ingredients
    const ingredientVector = ingredients!.map(ingredient => 
        normalizedText.includes(ingredient.toLowerCase()) ? 1 : 0
    );

    // Step 4: Generate one-hot vector for categories
    const categoryVector = categories!.map(categoryName => 
        normalizedText.includes(categoryName.toLowerCase()) ? 1 : 0
    );
    const mealTypeVector = mealTypes!.map(mealType => 
        normalizedText.includes(mealType.toLowerCase()) ? 1 : 0
    );
    const dietaryRestrictionVector = dietaryRestrictions!.map(restriction => 
        normalizedText.includes(restriction.toLowerCase()) ? 1 : 0
    );

    // Step 5: Return ingredient and category vectors
    return {ingredientVector, categoryVector, mealTypeVector, dietaryRestrictionVector};
}


export const getTopPredictions = (predictions: number[], numberOfResults: number): JSONObject[] => {
    return predictions
      .map((probability, index) => ({ index, probability }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, numberOfResults);
  }
  