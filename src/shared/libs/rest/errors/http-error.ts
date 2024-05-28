export class HttpError extends Error {
  constructor(
    public httpStatusCode: number,
    public message: string,
    public detail?: string
  ) {
    super(message);
  }
}
