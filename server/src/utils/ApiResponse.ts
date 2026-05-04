interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
}

class ApiResponse {
  constructor(statusCode:number, data: any, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
