class ErrorResponse extends Error {
  constructor(error) {
    super();
    this.message = error?.message || error;
    this.error = error?._message || error;
  }
}
module.exports = ErrorResponse;
