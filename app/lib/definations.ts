
export interface ResponseData {
    success: boolean;
    message?: string;
    data?: any;
}

export interface ActionType {
    type: string; 
    payload?: any;
}

export type JSONObject = { [key: string]: any };

export type Message = {type: string, msg: string};

export const dietaryMapping: { [key: string]: number[] } = {
    Vegetarian: [1, 0, 0, 0, 0],
    Vegan: [0, 1, 0, 0, 0],
    'Gluten-Free': [0, 0, 1, 0, 0],
    'Dairy-Free': [0, 0, 0, 1, 0],
    'Nut-Free': [0, 0, 0, 0, 1],
};