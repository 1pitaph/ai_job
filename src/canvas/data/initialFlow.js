// Vertical linear layout — all nodes centered at x=160 (card width=220)
// Pill nodes centered at x=235 (pill width≈90)

export const initialNodes = [
  {
    id: 'start',
    type: 'pill',
    position: { x: 235, y: 0 },
    data: { label: '开始' },
  },
  {
    id: 'upload',
    type: 'card',
    position: { x: 160, y: 80 },
    data: {
      icon: 'Upload',
      title: '上传简历 & JD',
      desc: '上传当前简历与目标岗位描述',
      status: 'idle',
    },
  },
  {
    id: 'diagnose',
    type: 'card',
    position: { x: 160, y: 280 },
    data: {
      icon: 'ScanSearch',
      title: 'AI 诊断',
      desc: '匹配度分析，识别硬伤与亮点',
      status: 'idle',
    },
  },
  {
    id: 'optimize',
    type: 'card',
    position: { x: 160, y: 480 },
    data: {
      icon: 'Wand2',
      title: 'AI 优化',
      desc: '智能重写简历，突出岗位匹配度',
      status: 'idle',
    },
  },
  {
    id: 'save',
    type: 'card',
    position: { x: 160, y: 680 },
    data: {
      icon: 'BookmarkCheck',
      title: '保存至简历库',
      desc: '多版本管理，随时切换与编辑',
      status: 'idle',
    },
  },
  {
    id: 'end',
    type: 'pill',
    position: { x: 235, y: 880 },
    data: { label: '完成' },
  },
]

const edgeBase = { animated: false }

export const initialEdges = [
  { id: 'e-start-upload',    source: 'start',    target: 'upload',   ...edgeBase, style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'e-upload-diagnose', source: 'upload',   target: 'diagnose', ...edgeBase, style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'e-diagnose-opt',    source: 'diagnose', target: 'optimize', ...edgeBase, style: { stroke: '#22C55E', strokeWidth: 1.5 } },
  { id: 'e-opt-save',        source: 'optimize', target: 'save',     ...edgeBase, style: { stroke: '#22C55E', strokeWidth: 1.5 } },
  { id: 'e-save-end',        source: 'save',     target: 'end',      ...edgeBase, style: { stroke: '#A855F7', strokeWidth: 1.5 } },
]
