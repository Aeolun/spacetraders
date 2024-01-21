import {AxiosError} from "axios";

export interface ApiError {
  error: {
    code: number,
  }
}
export const isApiError = (response: any): response is ApiError => {
  if (typeof response !== "object") {
    return false
  }
  if ('error' in response && 'code' in response.error) {
    return true;
  }
  return false;
}

export const isSTApiErrorResponse = (error: any): error is AxiosError<ApiError> => {
    if (error.isAxiosError && error.response) {
        return isApiError(error.response.data)
    }
    return false
}