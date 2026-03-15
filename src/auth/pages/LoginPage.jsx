import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate  = useNavigate()
  const [tab, setTab]         = useState('login')   // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)   // { type: 'error'|'success', text }

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
        navigate('/canvas')
      }
    }

    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          ai<span>job</span>
        </div>

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
