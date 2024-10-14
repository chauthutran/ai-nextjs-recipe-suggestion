
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

