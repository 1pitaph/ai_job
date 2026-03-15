import { Crosshair, AlertTriangle, Edit3, Globe, LayoutGrid, MessageSquare, Play, Folder, Mic, FileText } from 'lucide-react'
import styles from './HowToUseSection.module.css'

const path1Steps = [
  { step: 'STEP 1', icon: <Crosshair size={28} strokeWidth={1.4} />, title: '上传 JD + 简历', desc: '目标岗位 JD + 当前简历' },
  { step: 'STEP 2', icon: <AlertTriangle size={28} strokeWidth={1.4} />, title: 'AI 诊断', desc: '匹配度分析，识别硬伤与亮点' },
  { step: 'STEP 3', icon: <Edit3 size={28} strokeWidth={1.4} />, title: 'AI 优化 & 精调', desc: '智能优化，逐句精调' },
  { step: 'STEP 4', icon: <Globe size={28} strokeWidth={1.4} />, title: '英文版本（可选）', desc: '一键生成专业英文简历' },
]

const path2Steps = [
  { step: 'STEP 1', icon: <LayoutGrid size={28} strokeWidth={1.4} />, title: '输入岗位信息', desc: '填写目标岗位和 JD（可选）' },
  { step: 'STEP 2', icon: <MessageSquare size={28} strokeWidth={1.4} />, title: '选择面试模式', desc: '纯模拟 / 人机交互 / 五轮全流程' },
  { step: 'STEP 3', icon: <Play size={28} strokeWidth={1.4} />, title: '开始面试', desc: 'AI 面试官实时评估与反馈' },
]

export default function HowToUseSection() {
  return (
    <section id="how-to-use" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>如何使用 aijob</h2>
        <p className={styles.subtitle}>两种使用路径，满足不同求职阶段的需求</p>
      </div>

      {/* Path 1 */}
      <div className={`${styles.path} ${styles.pathActive}`}>
        <div className={styles.pathHeader}>
          <div className={styles.pathLeft}>
            <span className={`${styles.pathNum} ${styles.pathNumActive}`}>1</span>
            <span className={styles.pathTitle}>推荐路径：简历优化 → 模拟面试</span>
            <span className={styles.badgeStar}>✦ 最佳体验</span>
          </div>
          <button className={styles.ctaDark}>
            <FileText size={14} strokeWidth={2} />
            开始诊断 →
          </button>
        </div>

        <div className={styles.steps}>
          {path1Steps.map((s, i) => (
            <div key={i} className={styles.stepCard}>
              <span className={styles.stepLabel}>{s.step}</span>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.notes}>
          <p>
            <Folder size={14} strokeWidth={1.5} />
            优化后的简历可保存至<strong>简历库</strong>，支持多版本管理、收藏和随时编辑
          </p>
          <p>
            <Mic size={14} strokeWidth={1.5} />
            完成优化后，可直接进入模拟面试，简历和 JD 将自动填入
          </p>
        </div>
      </div>

      {/* Path 2 */}
      <div className={styles.path}>
        <div className={styles.pathHeader}>
          <div className={styles.pathLeft}>
            <span className={styles.pathNum}>2</span>
            <span className={styles.pathTitle}>快速路径：直接模拟面试</span>
            <span className={styles.badgeFlash}>⚡ 快速开始</span>
          </div>
          <button className={styles.ctaLight}>
            <Mic size={14} strokeWidth={2} />
            开始面试 →
          </button>
        </div>

        <div className={styles.steps}>
          {path2Steps.map((s, i) => (
            <div key={i} className={styles.stepCard}>
              <span className={styles.stepLabel}>{s.step}</span>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
