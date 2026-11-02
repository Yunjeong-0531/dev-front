import { StayBoard } from '@/features/accommodation/public'
import { Hero } from '../components/Hero'
import { Space } from '../components/Space'

/** 메인(랜딩) 화면. 다른 feature 의 컴포넌트는 반드시 그 feature 의 public.ts 를 통해 가져온다. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Space />
      <StayBoard />
    </>
  )
}
