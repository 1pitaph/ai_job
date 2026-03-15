import styles from './Navbar.module.css'

const NAVBAR_HEIGHT = 65

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function smoothScrollTo(targetY) {
  const startY = window.scrollY
  const maxScrollY = document.documentElement.scrollHeight - window.innerHeight
  const clampedTarget = Math.min(Math.max(targetY, 0), maxScrollY)
  const delta = clampedTarget - startY
  const duration = Math.min(Math.max(Math.abs(delta) * 0.9, 1000), 1500)
  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + delta * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

function handleNav(e, targetId) {
  e.preventDefault()
  if (!targetId) {
    smoothScrollTo(0)
    return
  }
  const el = document.getElementById(targetId)
  if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT)
}

export default function Navbar({ onLogin, onGetStarted }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        ai<span>job</span>
      </div>
      <ul className={styles.links}>
        <li><a href="#" onClick={(e) => handleNav(e, null)}>Features</a></li>
        <li><a href="#about" onClick={(e) => handleNav(e, 'about')}>About</a></li>
      </ul>
      <div className={styles.actions}>
        <button className={styles.login} onClick={onLogin}>Log in</button>
        <button className={styles.cta} onClick={onGetStarted}>Get Started</button>
      </div>
    </nav>
  )
}
