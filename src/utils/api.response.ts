export class ApiResponse {
  public success: boolean;
  constructor(
    public statusCode: number,
    public data: unknown,
    public message: string = "Success",
    public showMsg?: boolean
  ) {
    this.success = statusCode < 400;
    this.showMsg = showMsg === false ? false : true;
  }
}
