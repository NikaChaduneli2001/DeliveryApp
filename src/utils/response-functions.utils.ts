import { errorResponse } from "./error-response.interface";
import { responseType } from "./response-type.enum";
import { successResponse } from "./success-response.interface";

export function getSuccessMessage(data):successResponse{
    return {
        status:responseType.status,
        data,
    };
}

export function getErrorMessage(message):errorResponse{
    return { 
        status:responseType.error,
        error:message,
    }
}