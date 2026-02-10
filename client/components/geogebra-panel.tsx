"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/client/components/ui/button"
import { useGeoGebra } from "@/client/hooks/use-geogebra"

export function GeoGebraPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const { reset, setSize, isReady } = useGeoGebra()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // 计算尺寸的函数
  const calculateDimensions = useCallback(() => {
    if (!panelRef.current || !titleRef.current) return

    const height = panelRef.current.clientHeight - titleRef.current.clientHeight
    const width = panelRef.current.clientWidth

    // 只有当尺寸真正变化时才更新状态和调整大小
    if (width !== dimensions.width || height !== dimensions.height) {
      setDimensions({ width, height })
      if (isReady && width > 0 && height > 0) {
        setSize(width, height)
        const container = document.getElementById("geogebra-container")
        if (container) {
          container.style.width = width + 'px'
          container.style.height = height + 'px'
        }
      }
    }
  }, [dimensions.width, dimensions.height, isReady, setSize])

  // 调整GeoGebra大小 - 只在组件挂载和isReady变化时执行
  useEffect(() => {
    if (!isReady) return

    // 初始化时计算一次尺寸
    if (!isInitializedRef.current) {
      calculateDimensions()
      isInitializedRef.current = true
    }

    // 添加防抖的resize事件监听器
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }

      resizeTimeoutRef.current = setTimeout(() => {
        calculateDimensions()
      }, 100)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [isReady, calculateDimensions])

  return (
    <div id="geogebra-panel" ref={panelRef} className="flex flex-col h-full w-full border-l">
      <div id="geogebra-container" className="flex-1 w-full"></div>
    </div>
  )
}

