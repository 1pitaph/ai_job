import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import styles from './AuthModal.module.css'

export default function AuthModal({ onClose, defaultTab = 'login' }) {
  const navigate = useNavigate()
  const [tab, setTab]           = useState(defaultTab)
  const [step, setStep]         = useState('form') // 'form' | 'verify'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState(null)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef([])

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function switchTab(t) {
    setTab(t)
    setStep('form')
    setMessage(null)
    setOtp(['', '', '', '', '', ''])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (tab === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setStep('verify')
        setCountdown(60)
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

  async function handleVerify(e) {
    e.preventDefault()
    const token = otp.join('')
    if (token.length < 6) return
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
    if (error) {
      setMessage({ type: 'error', text: '验证码错误或已过期' })
    } else {
      onClose()
      navigate('/canvas')
    }
    setLoading(false)
  }

  async function handleResend() {
    if (countdown > 0) return
    setLoading(true)
    await supabase.auth.resend({ type: 'signup', email })
    setCountdown(60)
    setMessage({ type: 'success', text: '验证码已重新发送' })
    setLoading(false)
  }

  function handleOtpInput(index, value) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = [...otp]
    for (let i = 0; i < 6; i++) next[i] = text[i] || ''
    setOtp(next)
    otpRefs.current[Math.min(text.length, 5)]?.focus()
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
            onClick={() => switchTab('login')}
          >
            登录
          </button>
          <button
            className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
            onClick={() => switchTab('signup')}
          >
            注册
          </button>
        </div>

        {step === 'form' ? (
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
        ) : (
          <form className={styles.form} onSubmit={handleVerify}>
            <div className={styles.verifyHint}>
              验证码已发送至 <strong>{email}</strong>，请在 10 分钟内输入。
            </div>

            <div className={styles.otpRow} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  className={styles.otpInput}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            {message && (
              <p className={message.type === 'error' ? styles.error : styles.success}>
                {message.text}
              </p>
            )}

            <button className={styles.submit} type="submit" disabled={loading || otp.join('').length < 6}>
              {loading ? '验证中…' : '确认验证'}
            </button>

            <button
              type="button"
              className={styles.resend}
              onClick={handleResend}
              disabled={countdown > 0 || loading}
            >
              {countdown > 0 ? `重新发送（${countdown}s）` : '重新发送验证码'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
