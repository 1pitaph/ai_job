import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import '../canvas.css'
import { initialNodes, initialEdges } from '../data/initialFlow'
import CardNode from '../components/nodes/CardNode'
import PillNode from '../components/nodes/PillNode'
import CanvasNavbar from '../components/layout/CanvasNavbar'
import InsightPanel from '../components/layout/InsightPanel'

const nodeTypes = { card: CardNode, pill: PillNode }
const NODE_ZOOM = 1.8
const ANIM_MS   = 550

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Must be rendered inside <ReactFlow> to access its context
function FlowController({
  containerRef, nodes,
  isZoomed, setIsZoomed,
  onNodeClickRef, onNodeDblClickRef, onPaneClickRef,
  onNodeSelect,
}) {
  const { getViewport, setViewport } = useReactFlow()
  const animRef     = useRef(null)
  const clickTimer  = useRef(null)

  const animateTo = useCallback((tx, ty, tz) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    const { x: x0, y: y0, zoom: z0 } = getViewport()
    const start = performance.now()
    function step(now) {
      const ease = easeInOutCubic(Math.min((now - start) / ANIM_MS, 1))
      setViewport({ x: x0 + (tx - x0) * ease, y: y0 + (ty - y0) * ease, zoom: z0 + (tz - z0) * ease })
      if (ease < 1) animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
  }, [getViewport, setViewport])

  const fitAll = useCallback(() => {
    if (!containerRef.current) return
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect()
    const bounds = getNodesBounds(nodes)
    const { x, y, zoom } = getViewportForBounds(bounds, cw, ch, 0.1, 4, 0.25)
    animateTo(x, y, zoom)
  }, [nodes, containerRef, animateTo])

  const zoomToNode = useCallback((node) => {
    if (!containerRef.current) return
    const nw = node.measured?.width  ?? 220
    const nh = node.measured?.height ?? 130
    const cx = node.position.x + nw / 2
    const cy = node.position.y + nh / 2
    const { width: cw, height: ch } = containerRef.current.getBoundingClientRect()
    animateTo(cw / 2 - cx * NODE_ZOOM, ch / 2 - cy * NODE_ZOOM, NODE_ZOOM)
  }, [containerRef, animateTo])

  // Keep refs updated every render so they always close over latest state
  useEffect(() => {
    // Single click: select node; if already zoomed also pan to it
    onNodeClickRef.current = (_, node) => {
      onNodeSelect(node.id)
      if (!isZoomed) return
      if (clickTimer.current) clearTimeout(clickTimer.current)
      clickTimer.current = setTimeout(() => zoomToNode(node), 220)
    }

    // Double click: only active when NOT zoomed — zoom in on node
    onNodeDblClickRef.current = (_, node) => {
      if (isZoomed) return
      if (clickTimer.current) clearTimeout(clickTimer.current)
      zoomToNode(node)
      setIsZoomed(true)
    }

    // Pane click: always reset to fit-all and deselect
    onPaneClickRef.current = () => {
      if (clickTimer.current) clearTimeout(clickTimer.current)
      fitAll()
      setIsZoomed(false)
      onNodeSelect(null)
    }
  })

  // Re-fit on container resize
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(fitAll)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [fitAll, containerRef])

  // Cleanup on unmount
  useEffect(() => () => {
    if (animRef.current)    cancelAnimationFrame(animRef.current)
    if (clickTimer.current) clearTimeout(clickTimer.current)
  }, [])

  return null
}

function CanvasFlow({ onNodeSelect }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [isZoomed, setIsZoomed]  = useState(false)

  const containerRef     = useRef(null)
  const onNodeClickRef   = useRef(null)
  const onNodeDblClickRef = useRef(null)
  const onPaneClickRef   = useRef(null)

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        onNodeClick={(e, node)       => onNodeClickRef.current?.(e, node)}
        onNodeDoubleClick={(e, node) => onNodeDblClickRef.current?.(e, node)}
        onPaneClick={(e)             => onPaneClickRef.current?.(e)}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        defaultEdgeOptions={{ style: { stroke: '#0D0D0D', strokeWidth: 1.5 } }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="rgba(13,13,13,0.12)" />
        <FlowController
          containerRef={containerRef}
          nodes={nodes}
          isZoomed={isZoomed}
          setIsZoomed={setIsZoomed}
          onNodeClickRef={onNodeClickRef}
          onNodeDblClickRef={onNodeDblClickRef}
          onPaneClickRef={onPaneClickRef}
          onNodeSelect={onNodeSelect}
        />
      </ReactFlow>
    </div>
  )
}

export default function CanvasPage() {
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [sessionData, setSessionData] = useState({
    resume: '',
    jobDescription: '',
    diagnoseResult: null,
    optimizeResult: null,
  })

  return (
    <div className="canvas-root">
      <CanvasNavbar />
      <div className="canvas-body">
        <div className="canvas-left">
          <ReactFlowProvider>
            <CanvasFlow onNodeSelect={setSelectedNodeId} />
          </ReactFlowProvider>
        </div>
        <div className="canvas-right">
          <InsightPanel
            selectedNodeId={selectedNodeId}
            sessionData={sessionData}
            setSessionData={setSessionData}
          />
        </div>
      </div>
    </div>
  )
}
