import { useNavigate } from 'react-router-dom'
import styles from './CanvasNavbar.module.css'

export default function CanvasNavbar() {
  const navigate = useNavigate()

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        ai<span>job</span>
      </div>

      <div
        className={styles.avatar}
        title="用户头像"
        aria-label="User avatar"
      >
        <span className={styles.avatarInitial}>U</span>
      </div>
    </nav>
  )
}
