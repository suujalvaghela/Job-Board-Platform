class ApiResponse {
    constructor(statusCode , data , message = "success") {
      // super(message);
      this.statusCode = statusCode < 400;
      this.data = data;
      this.message = message;
    }
  }
  
  export { ApiResponse };
  