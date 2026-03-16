import { useState } from 'react'
import '../canvas.css'
import CanvasNavbar from '../components/layout/CanvasNavbar'
import InsightPanel from '../components/layout/InsightPanel'

export default function CanvasPage() {
  const [activeTab, setActiveTab] = useState('resume')
  const [sessionData, setSessionData] = useState({
    resume: '',
    jobDescription: '',
    diagnoseResult: null,
    optimizeResult: null,
  })

  return (
    <div className="canvas-root">
      <CanvasNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="canvas-body">
        <InsightPanel
          activeTab={activeTab}
          sessionData={sessionData}
          setSessionData={setSessionData}
        />
      </div>
    </div>
  )
}
