export type ApiErrorExtensions = {
  classification: string,
  exception: string,
  originalMessage: string,
}

export type ApiError = {
  extensions: ApiErrorExtensions,
  locations: unknown,
  message: string,
  path: string[],
}

export type ApiResponse = {
  errors?: ApiError[],
  data?: {
    [key: string]: unknown,
  },
}