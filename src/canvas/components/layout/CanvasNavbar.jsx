import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'
import { supabase } from '../../../lib/supabase'
import styles from './CanvasNavbar.module.css'

const tabs = [
  { id: 'resume',    label: '简历优化' },
  { id: 'interview', label: '模拟面试' },
  { id: 'matching',  label: '职业匹配' },
]

export default function CanvasNavbar({ activeTab, onTabChange }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? 'U'

  useEffect(() => {
    function onClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        ai<span>job</span>
      </div>

      <ul className={styles.tabs}>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.avatarWrap} ref={dropdownRef}>
        <button className={styles.avatar} onClick={() => setOpen(v => !v)}>
          {avatarLetter}
        </button>
        {open && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownEmail}>{user?.email}</div>
            <div className={styles.dropdownDivider} />
            <button className={styles.dropdownItem} onClick={() => navigate('/')}>
              回到主页
            </button>
            <button className={styles.dropdownItem} onClick={handleSignOut}>
              退出登录
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
