export class HttpError extends Error {
  constructor(status, text) {
    super(`${status} (${text})`);
    this.name = this.constructor.name;
    this.status;
    this.text = text;
  }
}
