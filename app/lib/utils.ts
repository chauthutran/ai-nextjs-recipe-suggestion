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