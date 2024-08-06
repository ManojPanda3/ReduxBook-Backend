class ApiError extends Error {
  constructor(status, msg = "Something went wrong", error = [], stack = "") {
    super(msg);
    this.status = status;
    this.msg = msg;
    this.success = false;
    this.data = null;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
