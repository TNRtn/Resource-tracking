export interface OpertaionalResult<T> {
      isSuccess: boolean;
  message: string;
  data: T;
  error: string | null;
}
