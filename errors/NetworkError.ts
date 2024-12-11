export class NetworkError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = 400;
  }
}
