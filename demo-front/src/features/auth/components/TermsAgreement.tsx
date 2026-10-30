import type { Term } from '../types'

interface Props {
  terms: Term[]
  agreed: Set<number>
  onToggle: (id: number) => void
  onToggleAll: (checked: boolean) => void
}

export function TermsAgreement({ terms, agreed, onToggle, onToggleAll }: Props) {
  const allChecked = terms.length > 0 && terms.every((t) => agreed.has(t.id))
  return (
    <fieldset>
      <legend>약관 동의</legend>
      <label>
        <input type="checkbox" checked={allChecked} onChange={(e) => onToggleAll(e.target.checked)} />{' '}
        <strong>전체 동의</strong>
      </label>
      {terms.map((t) => (
        <div key={t.id}>
          <label>
            <input type="checkbox" checked={agreed.has(t.id)} onChange={() => onToggle(t.id)} />{' '}
            [{t.required ? '필수' : '선택'}] {t.title}
          </label>
          <details>
            <summary>내용 보기</summary>
            <pre>{t.content}</pre>
          </details>
        </div>
      ))}
    </fieldset>
  )
}
