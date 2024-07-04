class CustomError extends Error {
  public statusCode: number
  public name: string

  constructor(name: string, statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = name

    // Set the prototype explicitly (necessary in some JavaScript environments)
    Object.setPrototypeOf(this, CustomError.prototype)

    // Maintain proper stack trace (only needed if targeting environments like V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
  }
}

export default CustomError
