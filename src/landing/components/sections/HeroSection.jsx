import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import styles from './HeroSection.module.css'

const modules = [
  { id: 'resume', label: '简历优化' },
  { id: 'interview', label: '模拟面试' },
  { id: 'matching', label: '职业匹配' },
]

const cards = {
  resume: [
    {
      title: '智能诊断',
      desc: '深度分析简历结构、关键词密度与 ATS 适配性，精准定位问题所在。',
    },
    {
      title: 'AI 优化',
      desc: '根据目标岗位 JD，自动重写简历内容，突出最相关的经历与技能。',
    },
    {
      title: '英文版本',
      desc: '一键生成专业英文简历，适配海外及外资企业投递需求。',
    },
    {
      title: '简历库',
      desc: '保存多个版本简历，针对不同岗位方向灵活切换与管理。',
    },
  ],
  interview: [
    {
      title: '纯模拟模式',
      desc: '面对 AI 面试官独立作答，模拟真实面试压力环境，强化临场表达。',
    },
    {
      title: '人机交互模式',
      desc: '实时对话式面试，AI 根据你的回答追问，贴近真实面试节奏。',
    },
    {
      title: '五轮全流程模拟',
      desc: '覆盖简历关、笔试关、HR 关、技术关、总监关，系统性备战完整招聘流程。',
    },
    {
      title: '谈薪博弈',
      desc: '模拟 Offer 谈判场景，学习锚定策略与让步技巧，争取最优薪资方案。',
    },
  ],
  matching: [
    { title: '即将上线', desc: '职业方向评估功能正在建设中，敬请期待。' },
    { title: '即将上线', desc: '岗位智能推荐功能正在建设中，敬请期待。' },
    { title: '即将上线', desc: '技能差距分析功能正在建设中，敬请期待。' },
  ],
}

export default function HeroSection() {
  const [active, setActive] = useState('resume')

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          {modules.map((mod) => (
            <button
              key={mod.id}
              className={`${styles.tab} ${active === mod.id ? styles.tabActive : ''}`}
              onClick={() => setActive(mod.id)}
            >
              {mod.label}
            </button>
          ))}
        </div>
        <span className={styles.arrow}><ChevronRight size={16} /><ChevronRight size={16} /><ChevronRight size={16} /></span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.cards}>
        {cards[active].map((card, i) => (
          <div key={i} className={styles.card}>
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
