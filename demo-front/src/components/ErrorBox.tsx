import { ApiError } from '../api/http'

/** 백엔드 에러 응답({code, message, fieldErrors})을 그대로 보여준다 (연동 확인용). */
export function ErrorBox({ error }: { error: unknown }) {
  if (!error) return null
  if (error instanceof ApiError) {
    return (
      <div className="box error">
        <strong>
          [{error.status}] {error.code}
        </strong>
        <div>{error.message}</div>
        {error.fieldErrors && (
          <ul>
            {Object.entries(error.fieldErrors).map(([field, msg]) => (
              <li key={field}>
                {field}: {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  return <div className="box error">{String(error)}</div>
}

export function InfoBox({ message }: { message: string | null }) {
  return message ? <div className="box info">{message}</div> : null
}
