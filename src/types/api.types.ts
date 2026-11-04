export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: unknown
  }
  status: number
}
