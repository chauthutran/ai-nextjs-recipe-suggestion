export * from "./arrUtils";
export * from "./modelUtils";
export * from "./recipeUtils";


export const getErrMessage = (ex: any) => {
    if (ex instanceof Error) {
        return `An error occurred: ${ex.message}`;
    }
    else if (ex.name === 'AbortError') {
        console.error('Fetch request timed out');
    }
    
    return `An unexpected error occurred: ${ex}`;
}
