import { Handle, Position } from '@xyflow/react'
import styles from './PillNode.module.css'

export default function PillNode({ data }) {
  return (
    <div className={styles.pill}>
      <Handle type="target" position={Position.Top} style={{ background: '#787878', width: 7, height: 7, border: 'none' }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ background: '#787878', width: 7, height: 7, border: 'none' }} />
    </div>
  )
}
