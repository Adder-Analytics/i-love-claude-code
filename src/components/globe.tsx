'use client'

import { useEffect, useRef } from 'react'
import createGlobe, { type COBEOptions } from 'cobe'

export type GlobeMarker = {
  location: [number, number]
  size: number
}

type Props = {
  markers: GlobeMarker[]
  className?: string
}

type RenderState = { phi: number; theta?: number; width: number; height: number; markers: GlobeMarker[] }
type ExtendedOptions = COBEOptions & { onRender?: (state: RenderState) => void }

const BASE_OPTIONS: Omit<COBEOptions, 'width' | 'height' | 'markers'> = {
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 1.3,
  mapSamples: 18000,
  mapBrightness: 4.5,
  baseColor: [0.18, 0.18, 0.22],
  markerColor: [1, 0.45, 0.2],
  glowColor: [1, 0.55, 0.3],
  scale: 1.05,
}

export function Globe({ markers, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const markersRef = useRef<GlobeMarker[]>(markers)
  const phiRef = useRef(0)
  const widthRef = useRef(0)

  useEffect(() => {
    markersRef.current = markers
  }, [markers])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onResize = () => {
      if (canvas) widthRef.current = canvas.offsetWidth
    }
    window.addEventListener('resize', onResize)
    onResize()

    const options: ExtendedOptions = {
      ...BASE_OPTIONS,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      markers: markersRef.current,
      onRender: (state: RenderState) => {
        if (!reducedMotion) phiRef.current += 0.0025
        state.phi = phiRef.current
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
        state.markers = markersRef.current
      },
    }
    const globe = createGlobe(canvas, options as COBEOptions)

    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = '1'
    })

    return () => {
      window.removeEventListener('resize', onResize)
      globe.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        contain: 'layout paint size',
        opacity: 0,
        transition: 'opacity 1.2s ease-out',
      }}
    />
  )
}
