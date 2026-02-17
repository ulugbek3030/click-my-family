export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;

  static ok<T>(data: T): ApiResponse<T> {
    const response = new ApiResponse<T>();
    response.success = true;
    response.data = data;
    response.timestamp = new Date().toISOString();
    return response;
  }

  static fail<T>(error: string): ApiResponse<T> {
    const response = new ApiResponse<T>();
    response.success = false;
    response.error = error;
    response.timestamp = new Date().toISOString();
    return response;
  }
}
