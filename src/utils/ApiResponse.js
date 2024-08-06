class ApiResponse {
  constructor(status, data, msg = "Success") {
    this.data = data;
    this.message = msg;
    this.status = status;
    this.success = status < 400;
  }
}

export default ApiResponse;
