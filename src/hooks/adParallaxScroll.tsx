import React, { useState, useEffect } from 'react'

const speedFactor = 1.8

interface AdParallaxScroll {
  containerRef: React.RefObject<(HTMLDivElement | null)>
  adRef: React.RefObject<(HTMLDivElement | null)>
}

const adParallaxScroll = ({ containerRef, adRef }: AdParallaxScroll): number => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !adRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const adRect = adRef.current.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const absoluteContainerCenter = rect.top + rect.height / 2
      const distanceFromCenter = absoluteContainerCenter - viewportCenter
      
      const offsetValue = (distanceFromCenter * speedFactor - rect.height / 2 + adRect.height / 2) * -1

      setOffset(offsetValue)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Run once to set initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return offset
}

export default adParallaxScroll