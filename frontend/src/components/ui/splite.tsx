import { Suspense, lazy, useCallback, useImperativeHandle, useRef, forwardRef } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export interface SplineSceneHandle {
  triggerLookAway: () => void
  triggerLookAtForm: () => void
  triggerLookStraight: () => void
  triggerLookBack: () => void
}

export const SplineScene = forwardRef<SplineSceneHandle, SplineSceneProps>(
  function SplineScene({ scene, className }, ref) {
    const appRef = useRef<any>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const sendToCanvas = (xFraction: number, yFraction: number) => {
      const canvas = containerRef.current?.querySelector('canvas')
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const clientX = rect.left + rect.width * xFraction
      const clientY = rect.top + rect.height * yFraction
      canvas.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, bubbles: true, pointerType: 'mouse' }))
      canvas.dispatchEvent(new MouseEvent('mousemove', { clientX, clientY, bubbles: true }))
    }

    useImperativeHandle(ref, () => ({
      triggerLookAway: () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'all'
        const fire = () => sendToCanvas(1.6, 0.8)
        fire()
        intervalRef.current = setInterval(fire, 80)
      },
      triggerLookAtForm: () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'all'
        const fire = () => sendToCanvas(-0.4, 0.5)
        fire()
        intervalRef.current = setInterval(fire, 80)
      },
      triggerLookStraight: () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'all'
        const fire = () => sendToCanvas(0.5, 0.5)
        fire()
        intervalRef.current = setInterval(fire, 80)
      },
      triggerLookBack: () => {
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'
      },
    }))

    const handleLoad = useCallback((splineApp: any) => {
      appRef.current = splineApp
      const renderer = splineApp?.renderer ?? splineApp?._renderer
      if (renderer) {
        renderer.setClearColor?.(0x000000, 0)
        renderer.setClearAlpha?.(0)
        if (renderer.domElement?.style) {
          renderer.domElement.style.background = 'transparent'
          renderer.domElement.style.backgroundColor = 'transparent'
        }
      }
      const scene3d = splineApp?.scene ?? splineApp?._scene
      if (scene3d) scene3d.background = null
    }, [])

    return (
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
        }
      >
        <div
          ref={containerRef}
          className="spline-canvas-wrapper w-full h-full"
          style={{ background: 'transparent', position: 'relative' }}
        >
          <Spline scene={scene} className={className} onLoad={handleLoad} />
          {/* Transparent overlay — when active, sits on top and swallows real pointer events */}
          <div
            ref={overlayRef}
            style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}
          />
        </div>
      </Suspense>
    )
  }
)
