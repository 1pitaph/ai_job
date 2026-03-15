import { Handle, Position } from '@xyflow/react'
import * as Icons from 'lucide-react'
import styles from './CardNode.module.css'

const STATUS_MAP = {
  idle:    { label: '待执行', cls: styles.badgeIdle },
  running: { label: '执行中', cls: styles.badgeRunning },
  done:    { label: '已完成', cls: styles.badgeDone },
}

export default function CardNode({ data, selected }) {
  const Icon = Icons[data.icon] ?? Icons.Box
  const status = STATUS_MAP[data.status] ?? STATUS_MAP.idle

  return (
    <div className={`${styles.card} ${selected ? styles.cardSelected : ''}`}>
      <Handle type="target" position={Position.Top} style={{ background: '#0D0D0D', width: 8, height: 8, border: 'none' }} />

      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <Icon size={16} strokeWidth={1.5} />
        </div>
        <div className={styles.info}>
          <span className={styles.title}>{data.title}</span>
          <span className={styles.desc}>{data.desc}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={`${styles.badge} ${status.cls}`}>
          <span className={styles.dot} />
          {status.label}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#0D0D0D', width: 8, height: 8, border: 'none' }} />
    </div>
  )
}
