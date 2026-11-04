export type EntityId = string

export interface BaseEntity {
  id: EntityId
  createdAt: string
  updatedAt: string
}

export type StatusState = "idle" | "loading" | "success" | "error"

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type SortOrder = "asc" | "desc"
