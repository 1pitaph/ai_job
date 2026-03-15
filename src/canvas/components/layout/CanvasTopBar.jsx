import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Play, Settings, LayoutList } from 'lucide-react'
import styles from './CanvasTopBar.module.css'

export default function CanvasTopBar() {
  const navigate = useNavigate()

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={16} strokeWidth={1.8} />
        </button>
        <div className={styles.titleGroup}>
          <span className={styles.title}>AI 求职助手</span>
          <ChevronDown size={14} strokeWidth={1.8} className={styles.chevron} />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn}>
          <LayoutList size={16} strokeWidth={1.6} />
        </button>
        <button className={styles.iconBtn}>
          <Settings size={16} strokeWidth={1.6} />
        </button>
        <button className={styles.runBtn}>
          <Play size={12} strokeWidth={2} />
          运行
        </button>
      </div>
    </div>
  )
}
