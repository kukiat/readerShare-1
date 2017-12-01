module.exports = function CustomError(status , message) {
  return {
    status: status,
    message: message
  }
}