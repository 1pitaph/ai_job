import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import styles from './AuthModal.module.css'

export default function AuthModal({ onClose, defaultTab = 'login' }) {
  const navigate = useNavigate()
  const [tab, setTab]           = useState(defaultTab)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState(null)

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (tab === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: '注册成功！请查收验证邮件，点击链接后即可登录。' })
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        onClose()
        navigate('/canvas')
      }
    }

    setLoading(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <X size={16} strokeWidth={1.5} />
        </button>

        <div className={styles.logo}>ai<span>job</span></div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setTab('login'); setMessage(null) }}
          >
            登录
          </button>
          <button
            className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
            onClick={() => { setTab('signup'); setMessage(null) }}
          >
            注册
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>邮箱</label>
            <input
              className={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>密码</label>
            <input
              className={styles.input}
              type="password"
              placeholder="至少 6 位"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={message.type === 'error' ? styles.error : styles.success}>
              {message.text}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? '请稍候…' : tab === 'login' ? '登录' : '注册'}
          </button>
        </form>
      </div>
    </div>
  )
}
