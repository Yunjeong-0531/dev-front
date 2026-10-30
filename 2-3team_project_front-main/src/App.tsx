import './App.css'
import Header from './components/Header'
import ReservationTab from './components/ReservationTab'
import Hero from './components/Hero'
import Space from './components/Space'
import StayBoard from './components/StayBoard'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <ReservationTab />
      <main>
        <Hero />
        <Space />
        <StayBoard />
      </main>
      <Footer />
    </>
  )
}

export default App