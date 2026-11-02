import { useEffect, useState } from 'react'

function Header() {
  // 스크롤을 내렸는지 기억하는 상태
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // 스크롤할 때마다 40px 넘게 내려왔는지 확인
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    // 화면에서 사라질 때 감시를 해제 (정리 작업)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'header scrolled' : 'header'}>
      <a href="#top" className="brand">GREEN</a>

      <nav className="header-nav">
        <a href="#about">BRAND</a>
        <a href="#stays">STAYS</a>
        <a href="#contact">CONTACT</a>
      </nav>

      <div className="header-util">
        <span>KO</span>
        <span>MY</span>
      </div>
    </header>
  )
}

export default Header