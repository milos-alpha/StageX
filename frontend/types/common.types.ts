// src/types/common.types.ts
export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface PaginationData {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination?: PaginationData
  error?: string
}