import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import styles from './ModulesSection.module.css'

const modules = [
  {
    id: 'resume',
    title: '简历优化',
    headline: 'Resume\nOptimization',
    caption: 'TAILORED FOR\nEVERY ROLE\nYOU APPLY TO',
    desc: 'AI analyzes job descriptions and rewrites your resume to highlight exactly what each employer needs — maximizing your chances of getting noticed.',
  },
  {
    id: 'interview',
    title: '模拟面试',
    headline: 'Mock\nInterview',
    caption: 'PRACTICE WITH\nAN AI THAT\nKNOWS YOUR ROLE',
    desc: 'Simulate real interviews with an adaptive AI interviewer. Get instant feedback on your answers, tone, and structure after every session.',
  },
  {
    id: 'matching',
    title: '职业匹配',
    headline: 'Career\nMatching',
    caption: 'DISCOVER YOUR\nPERFECT\nNEXT MOVE',
    desc: 'Our AI maps your skills and goals to thousands of open roles, surfacing opportunities you might never have found on your own.',
  },
]

export default function ModulesSection() {
  const [active, setActive] = useState(modules[0])

  return (
    <section id="modules" className={styles.section}>
      <div className={styles.topBar}>
        <div className={styles.badges}>
          <span className={styles.badgeLight}>02</span>
          {modules.map((mod) => (
            <button
              key={mod.id}
              className={`${styles.moduleBtn} ${active.id === mod.id ? styles.moduleBtnActive : ''}`}
              onClick={() => setActive(mod)}
            >
              {mod.title}
            </button>
          ))}
        </div>
        <span className={styles.nav}><ChevronRight size={16} /><ChevronRight size={16} /><ChevronRight size={16} /></span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.content}>
        <h2 className={styles.headline}>
          {active.headline.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h2>
        <div className={styles.right}>
          <p className={styles.caption}>
            {active.caption.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </p>
          <p className={styles.desc}>{active.desc}</p>
        </div>
      </div>

      <div className={styles.bracket}>
        <svg viewBox="0 0 900 40" fill="none" preserveAspectRatio="none">
          <path d="M150 4 C150 4 150 36 0 36" stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M150 4 L750 4" stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M750 4 C750 4 750 36 900 36" stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="450" y1="4" x2="450" y2="36" stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="150" y1="4" x2="150" y2="20" stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="750" y1="4" x2="750" y2="20" stroke="#0D0D0D" strokeWidth="1" strokeOpacity="0.2" />
        </svg>
      </div>
    </section>
  )
}
