import { useState } from 'react'
import { Upload, ScanSearch, Wand2, BookmarkCheck, Zap, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import styles from './InsightPanel.module.css'

/* ── SVG Connector (matches reference exactly) ── */
function Connector() {
  return (
    <div className={styles.connector}>
      <svg width="12" height="40" viewBox="0 0 12 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="5" r="3" fill="#9CA3AF" />
        <line x1="6" y1="5" x2="6" y2="34" stroke="#9CA3AF" strokeWidth="1.5" />
        <path d="M2.5 31 L6 36 L9.5 31 Z" fill="#9CA3AF" />
      </svg>
    </div>
  )
}

/* ── WorkflowGroup: badge (top-rounded only) + card with shared hover ── */
function WorkflowGroup({ badgeBg, badgeColor, icon: Icon, label, children }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={styles.group}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={styles.badge}
        style={{
          backgroundColor: badgeBg,
          color: badgeColor,
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        <Icon size={13} strokeWidth={2} />
        <span>{label}</span>
      </div>
      <div
        className={styles.card}
        style={{
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hovered
            ? '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.08)'
            : '0 2px 12px -4px rgba(0,0,0,0.04)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ── Upload content ── */
function UploadContent({ sessionData, setSessionData }) {
  return (
    <>
      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>你的简历</div>
        <textarea
          className={styles.textarea}
          placeholder="粘贴简历内容..."
          value={sessionData.resume}
          onChange={e => setSessionData(s => ({ ...s, resume: e.target.value }))}
        />
      </div>
      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>目标岗位描述（选填）</div>
        <textarea
          className={`${styles.textarea} ${styles.textareaShort}`}
          placeholder="粘贴岗位描述，留空则进行通用诊断..."
          value={sessionData.jobDescription}
          onChange={e => setSessionData(s => ({ ...s, jobDescription: e.target.value }))}
        />
      </div>
    </>
  )
}

/* ── Diagnose content ── */
function DiagnoseContent({ sessionData, setSessionData }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleDiagnose() {
    if (!sessionData.resume.trim()) { setError('请先填写简历内容'); return }
    setLoading(true); setError(null)
    const { data, error: fnErr } = await supabase.functions.invoke('kimi-chat', {
      body: { action: 'diagnose', resume: sessionData.resume, jobDescription: sessionData.jobDescription },
    })
    setLoading(false)
    if (fnErr || data?.error) { setError(fnErr?.message ?? data.error); return }
    setSessionData(s => ({ ...s, diagnoseResult: data.result }))
  }

  return (
    <>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>分析简历与岗位匹配度</span>
        <button className={styles.runBtn} onClick={handleDiagnose} disabled={loading}>
          {loading ? <Loader2 size={12} className={styles.spin} /> : <Zap size={12} />}
          {loading ? '诊断中…' : '开始诊断'}
        </button>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {sessionData.diagnoseResult ? (
        <>
          <div className={styles.divider} />
          <div className={styles.resultBox}>
            {sessionData.diagnoseResult.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('**') ? styles.resultHeading : styles.resultLine}>
                {line.replace(/\*\*/g, '')}
              </p>
            ))}
          </div>
        </>
      ) : (
        !loading && <p className={styles.cardDesc}>AI 将分析你的简历，找出与岗位的差距与亮点。</p>
      )}
    </>
  )
}

/* ── Optimize content ── */
function OptimizeContent({ sessionData, setSessionData }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleOptimize() {
    if (!sessionData.resume.trim()) { setError('请先填写简历内容'); return }
    setLoading(true); setError(null)
    const { data, error: fnErr } = await supabase.functions.invoke('kimi-chat', {
      body: { action: 'optimize', resume: sessionData.resume, jobDescription: sessionData.jobDescription },
    })
    setLoading(false)
    if (fnErr || data?.error) { setError(fnErr?.message ?? data.error); return }
    setSessionData(s => ({ ...s, optimizeResult: data.result }))
  }

  return (
    <>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>重写并优化简历</span>
        <button className={styles.runBtn} onClick={handleOptimize} disabled={loading}>
          {loading ? <Loader2 size={12} className={styles.spin} /> : <Zap size={12} />}
          {loading ? '优化中…' : '开始优化'}
        </button>
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {sessionData.optimizeResult ? (
        <>
          <div className={styles.divider} />
          <div className={styles.resultBox}>
            {sessionData.optimizeResult.split('\n').map((line, i) => (
              <p key={i} className={styles.resultLine}>{line}</p>
            ))}
          </div>
        </>
      ) : (
        !loading && <p className={styles.cardDesc}>根据岗位要求重写简历，突出匹配度与核心技能。</p>
      )}
    </>
  )
}

/* ── Save content ── */
function SaveContent({ sessionData }) {
  const [saved, setSaved] = useState(false)
  return (
    <>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>保存至简历库</span>
        {!saved && (
          <button className={styles.runBtn} onClick={() => setSaved(true)}>
            <BookmarkCheck size={12} />
            保存
          </button>
        )}
      </div>
      <p className={styles.cardDesc} style={saved ? { color: '#16A34A' } : {}}>
        {saved ? '✓ 已保存至简历库。' : '将当前优化结果保存为一个简历版本，随时切换与编辑。'}
      </p>
    </>
  )
}

/* ── Resume Flow ── */
function ResumeFlow({ sessionData, setSessionData }) {
  const p = { sessionData, setSessionData }
  return (
    <div className={styles.flow}>
      <WorkflowGroup badgeBg="#f0ebfc" badgeColor="#6333d4" icon={Upload} label="上传资料">
        <UploadContent {...p} />
      </WorkflowGroup>

      <Connector />

      <WorkflowGroup badgeBg="#eff8f0" badgeColor="#347d39" icon={ScanSearch} label="AI 诊断">
        <DiagnoseContent {...p} />
      </WorkflowGroup>

      <Connector />

      <WorkflowGroup badgeBg="#dff6fa" badgeColor="#0d7d91" icon={Wand2} label="AI 优化">
        <OptimizeContent {...p} />
      </WorkflowGroup>

      <Connector />

      <WorkflowGroup badgeBg="#fef3e2" badgeColor="#b45309" icon={BookmarkCheck} label="保存结果">
        <SaveContent {...p} />
      </WorkflowGroup>
    </div>
  )
}

/* ── Empty ── */
function EmptyPanel({ label }) {
  return (
    <div className={styles.empty}>
      <p>{label} 功能即将上线</p>
    </div>
  )
}

/* ── 主组件 ── */
export default function InsightPanel({ activeTab, sessionData, setSessionData }) {
  if (activeTab === 'resume') {
    return (
      <div className={styles.scrollWrap}>
        <ResumeFlow sessionData={sessionData} setSessionData={setSessionData} />
      </div>
    )
  }
  if (activeTab === 'interview') return <div className={styles.scrollWrap}><EmptyPanel label="模拟面试" /></div>
  if (activeTab === 'matching')  return <div className={styles.scrollWrap}><EmptyPanel label="职业匹配" /></div>
  return null
}
