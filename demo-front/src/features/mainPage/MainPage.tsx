

import ReservationTab from './components/ReservationTab'
import Hero from './components/Hero'
import Space from './components/Space'
import StayBoard from './components/StayBoard'

import './styles/variables.css'
import './styles/main-page.css'

export default function MainPage() {
  return (
    <div className="main-page">

      <ReservationTab />

      <main>
        <Hero />
        <Space />
        <StayBoard />
      </main>


    </div>
  )

}

