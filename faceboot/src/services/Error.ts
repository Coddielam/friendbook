export type IErrorMeta = {
  developerMsg?: string;
  error?: unknown;
  code?: number;
} | null;

export class CustomError extends Error {
  protected meta: IErrorMeta;

  constructor(msg: string | undefined, meta: IErrorMeta) {
    super(msg);
    this.meta = meta;
  }
}
