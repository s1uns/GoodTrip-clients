export type ServerResponse<TData> = {
  code: number;
  message: string;
  data?: TData;
  success: boolean;
};
