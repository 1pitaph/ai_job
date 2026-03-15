import { useState } from 'react'
import { FileText, Upload, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import styles from './InsightPanel.module.css'

const tabs = [
  { id: 'resume',    label: '简历优化' },
  { id: 'interview', label: '模拟面试' },
  { id: 'matching',  label: '职业匹配' },
]

/* ── 上传简历 & JD ── */
function UploadPanel({ sessionData, setSessionData }) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <div className={styles.formTitle}>
          <FileText size={15} strokeWidth={1.5} />
          <span>你的简历</span>
        </div>
        <button className={styles.uploadBtn}>
          <Upload size={13} strokeWidth={1.5} />
          上传文件
        </button>
      </div>
      <p className={styles.formHint}>
        支持 PDF、Word（.doc/.docx）、图片，单文件 ≤3MB；建议优先使用 PDF 或 .docx。
      </p>
      <textarea
        className={styles.textarea}
        placeholder="粘贴简历内容，或直接上传/截图粘贴..."
        value={sessionData.resume}
        onChange={(e) => setSessionData((s) => ({ ...s, resume: e.target.value }))}
      />

      <div className={styles.formHeader} style={{ marginTop: 16 }}>
        <div className={styles.formTitle}>
          <FileText size={15} strokeWidth={1.5} />
          <span>目标岗位描述（JD）</span>
        </div>
      </div>
      <p className={styles.formHint}>粘贴目标岗位的招聘要求，留空则进行通用诊断。</p>
      <textarea
        className={styles.textarea}
        placeholder="粘贴岗位描述..."
        value={sessionData.jobDescription}
        onChange={(e) => setSessionData((s) => ({ ...s, jobDescription: e.target.value }))}
      />
    </div>
  )
}

/* ── AI 诊断 ── */
function DiagnosePanel({ sessionData, setSessionData }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleDiagnose() {
    if (!sessionData.resume.trim()) {
      setError('请先在「上传简历」节点填写简历内容')
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: fnErr } = await supabase.functions.invoke('kimi-chat', {
      body: {
        action: 'diagnose',
        resume: sessionData.resume,
        jobDescription: sessionData.jobDescription,
      },
    })
    setLoading(false)
    if (fnErr || data?.error) {
      setError(fnErr?.message ?? data.error)
      return
    }
    setSessionData((s) => ({ ...s, diagnoseResult: data.result }))
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <div className={styles.formTitle}>
          <span>AI 诊断</span>
        </div>
        <button
          className={styles.actionBtn}
          onClick={handleDiagnose}
          disabled={loading}
        >
          {loading ? <Loader2 size={13} className={styles.spin} /> : null}
          {loading ? '诊断中…' : '开始诊断'}
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {sessionData.diagnoseResult ? (
        <div className={styles.resultBox}>
          {sessionData.diagnoseResult.split('\n').map((line, i) => (
            <p key={i} className={line.startsWith('**') ? styles.resultHeading : styles.resultLine}>
              {line.replace(/\*\*/g, '')}
            </p>
          ))}
        </div>
      ) : (
        !loading && <p className={styles.formHint}>点击「开始诊断」，AI 将分析简历与岗位的匹配度。</p>
      )}
    </div>
  )
}

/* ── AI 优化 ── */
function OptimizePanel({ sessionData, setSessionData }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  async function handleOptimize() {
    if (!sessionData.resume.trim()) {
      setError('请先在「上传简历」节点填写简历内容')
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: fnErr } = await supabase.functions.invoke('kimi-chat', {
      body: {
        action: 'optimize',
        resume: sessionData.resume,
        jobDescription: sessionData.jobDescription,
      },
    })
    setLoading(false)
    if (fnErr || data?.error) {
      setError(fnErr?.message ?? data.error)
      return
    }
    setSessionData((s) => ({ ...s, optimizeResult: data.result }))
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <div className={styles.formTitle}>
          <span>AI 优化</span>
        </div>
        <button
          className={styles.actionBtn}
          onClick={handleOptimize}
          disabled={loading}
        >
          {loading ? <Loader2 size={13} className={styles.spin} /> : null}
          {loading ? '优化中…' : '开始优化'}
        </button>
      </div>

      {error && <p className={styles.errorText}>{error}</p>}

      {sessionData.optimizeResult ? (
        <div className={styles.resultBox}>
          {sessionData.optimizeResult.split('\n').map((line, i) => (
            <p key={i} className={styles.resultLine}>{line}</p>
          ))}
        </div>
      ) : (
        !loading && <p className={styles.formHint}>AI 将根据岗位描述重写简历，突出匹配度。</p>
      )}
    </div>
  )
}

/* ── 保存至简历库 ── */
function SavePanel({ sessionData }) {
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // TODO: 接入 Supabase Database 存储
    setSaved(true)
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <div className={styles.formTitle}>
          <span>保存至简历库</span>
        </div>
        {!saved && (
          <button className={styles.actionBtn} onClick={handleSave}>
            保存
          </button>
        )}
      </div>
      {saved ? (
        <p className={styles.formHint} style={{ color: '#22C55E' }}>已保存至简历库。</p>
      ) : (
        <p className={styles.formHint}>将当前优化结果保存为一个简历版本，随时切换与编辑。</p>
      )}
    </div>
  )
}

/* ── 主组件 ── */
const NODE_PANELS = {
  upload:   (props) => <UploadPanel   {...props} />,
  diagnose: (props) => <DiagnosePanel {...props} />,
  optimize: (props) => <OptimizePanel {...props} />,
  save:     (props) => <SavePanel     {...props} />,
}

export default function InsightPanel({ selectedNodeId, sessionData, setSessionData }) {
  const [active, setActive] = useState('resume')

  const PanelContent = NODE_PANELS[selectedNodeId]

  return (
    <div className={styles.panel}>
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        <button className={`${styles.tab} ${styles.tabCustom}`}>自定义</button>
      </div>
      <div className={styles.body}>
        {PanelContent
          ? <PanelContent sessionData={sessionData} setSessionData={setSessionData} />
          : null}
      </div>
    </div>
  )
}
