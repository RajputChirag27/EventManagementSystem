export class ApiHandler {
  private success: boolean
  constructor(
    private readonly result: any,
    private readonly message?: string
  ) {
    this.success = true
    this.message = message
    this.result = result
  }
}
