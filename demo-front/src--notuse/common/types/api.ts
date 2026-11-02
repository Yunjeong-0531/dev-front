/** 백엔드 공통 에러 응답 */
export interface ErrorResponse {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}

export interface MessageResponse {
  message: string
}
