// 숙소 한 개가 가진 정보의 "모양"을 정해두기 (타입)
export type Stay = {
  id: number
  name: string
  region: string      // 칸반의 열 기준
  place: string
  tag: string         // 탭 필터 기준
  guests: string
  price: number
  discount?: number   // ? 는 "없어도 된다"는 뜻
  tone: string        // 사진이 없을 때 대신 깔 색
  image?: string      // 사진 경로 (나중에 넣을 자리)
}

// 사진 대신 쓰는 와인/베이지 그라데이션 4종
const wine = 'linear-gradient(160deg, #7a2438, #3b0f1a)'
const rose = 'linear-gradient(160deg, #c79aa4, #8c4a5b)'
const sand = 'linear-gradient(160deg, #e6dccd, #b79f86)'
const mocha = 'linear-gradient(160deg, #a58a76, #5c4338)'

// 칸반의 열(지역)과 탭(테마) 목록
export const regions = ['제주', '강원', '경상', '전라']
export const tags = ['자연', '한옥', '디자인', '건축']

export const stays: Stay[] = [
  { id: 1, name: '하늘결 빌라', region: '제주', place: '서귀포', tag: '자연', guests: '2~4명', price: 320000, discount: 15, tone: wine },
  { id: 2, name: '돌담 아뜰리에', region: '제주', place: '애월', tag: '디자인', guests: '2~3명', price: 245000, tone: sand },
  { id: 3, name: '오름 사이 하우스', region: '제주', place: '한림', tag: '건축', guests: '2~6명', price: 410000, discount: 20, tone: mocha },

  { id: 4, name: '파도결 리트릿', region: '강원', place: '속초', tag: '자연', guests: '2~4명', price: 289000, discount: 10, tone: rose },
  { id: 5, name: '호수 서재', region: '강원', place: '춘천', tag: '디자인', guests: '2~4명', price: 198000, discount: 30, tone: sand },
  { id: 6, name: '솔숲 갤러리', region: '강원', place: '고성', tag: '건축', guests: '2~6명', price: 365000, tone: wine },

  { id: 7, name: '달빛 고택', region: '경상', place: '경주', tag: '한옥', guests: '2~6명', price: 340000, discount: 18, tone: mocha },
  { id: 8, name: '윤슬 하우스', region: '경상', place: '남해', tag: '자연', guests: '2~4명', price: 180000, discount: 10, tone: rose },
  { id: 9, name: '청송재', region: '경상', place: '안동', tag: '한옥', guests: '4~8명', price: 275000, tone: wine },

  { id: 10, name: '소리재 한옥', region: '전라', place: '남원', tag: '한옥', guests: '4~6명', price: 330000, discount: 27, tone: sand },
  { id: 11, name: '구름 건축관', region: '전라', place: '무주', tag: '건축', guests: '2~4명', price: 258000, discount: 28, tone: mocha },
  { id: 12, name: '정원 오두막', region: '전라', place: '순천', tag: '자연', guests: '2~4명', price: 215000, tone: rose },
]