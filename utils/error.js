class ErrorResponse extends Error {
  constructor(error, statusCode) {
    super();
    this.message = error?.message || error;
    this.error = error?._message || error;
    this.statusCode = statusCode;
  }
}
module.exports = ErrorResponse;
