import React, { useState, useEffect } from 'react'

interface AdSlotState {
  visibleAdIndex: number | null
  currentlyDisabledAdIndices: number[]
  shownAdIndices: number[]
  viewportAdIndices: number[]
  viewportWidth: number
}

interface AdSlotsObserver {
  adSlotsRefs: React.RefObject<(HTMLDivElement | null)[]>
}

const adSlotsObserver = ({ adSlotsRefs }: AdSlotsObserver): AdSlotState => {
  const [adSlotsState, setAdSlotsState] = useState<AdSlotState>({
    visibleAdIndex: null,
    currentlyDisabledAdIndices: [],
    shownAdIndices: [],
    viewportAdIndices: [],
    viewportWidth: window.innerWidth
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const joinedViewportAdSlotIndizes = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => adSlotsRefs.current.findIndex((el) => el === entry.target))

        const leftViewPortAdIndizes = entries
          .filter((entry) => !entry.isIntersecting)
          .map((entry) => adSlotsRefs.current.findIndex((el) => el === entry.target))

        setAdSlotsState((prevAdSlotsState) => {
          const prevViewportAdIndices = prevAdSlotsState.viewportAdIndices
          var updatedViewportAdIndices = Array.from(new Set([...prevViewportAdIndices, ...joinedViewportAdSlotIndizes].filter((adIndex) => leftViewPortAdIndizes.indexOf(adIndex) === -1)))

          const prevVisibleAdIndex = prevAdSlotsState.visibleAdIndex
          var prevShownAdIndices = prevAdSlotsState.shownAdIndices

          // clean up in case of layout changes and multiple already shown ad slots are in the same viewport
          const shownAdSlotsInViewport = updatedViewportAdIndices.filter((adIndex) => prevShownAdIndices.indexOf(adIndex) !== -1)
          if (shownAdSlotsInViewport.length > 1 && prevVisibleAdIndex != null) {
            prevShownAdIndices = [prevVisibleAdIndex]
          }

          if (prevVisibleAdIndex != null && updatedViewportAdIndices.indexOf(prevVisibleAdIndex) !== -1) {
            // early exit, ad is still in viewport visible
            const updatedCurrentlyDisabledAdIndices = Array.from(new Set([...prevAdSlotsState.currentlyDisabledAdIndices, ...updatedViewportAdIndices].filter((adIndex) => adIndex !== prevVisibleAdIndex)))
            return {
              visibleAdIndex: prevVisibleAdIndex,
              viewportAdIndices: updatedViewportAdIndices,
              shownAdIndices: prevShownAdIndices,
              currentlyDisabledAdIndices: updatedCurrentlyDisabledAdIndices,
              viewportWidth: window.innerWidth
            }
          }
          
          // check for visible slots
          if (updatedViewportAdIndices.length > 0) {
            const availableAdSlots = updatedViewportAdIndices.filter((viewportAdSlot) => prevAdSlotsState.currentlyDisabledAdIndices.indexOf(viewportAdSlot) === -1)

            if (availableAdSlots.length > 0) {
              const newIndex = Math.max(0, Math.floor(availableAdSlots.length / 2) - 1) // take middle value, other options, first, last, - 1 as index
              // const newIndex = availableAdSlots[0] // first
              // const newIndex = availableAdSlots[availableAdSlots.length - 1] // last
              const newVisibleAdIndex = availableAdSlots[newIndex]
              
              const updatedCurrentlyDisabledAdIndices = Array.from(new Set([...prevAdSlotsState.currentlyDisabledAdIndices, ...updatedViewportAdIndices].filter((adIndex) => adIndex !== newVisibleAdIndex)))
              const updatedShownAdIndices = Array.from(new Set([...prevShownAdIndices, newVisibleAdIndex]))
  
              return {
                visibleAdIndex: newVisibleAdIndex,
                viewportAdIndices: updatedViewportAdIndices,
                shownAdIndices: updatedShownAdIndices,
                currentlyDisabledAdIndices: updatedCurrentlyDisabledAdIndices,
                viewportWidth: window.innerWidth
              }
            }
          }

          // no ad slot shown - if the viewport width changed we should the next one otherwise we keep the ones we have shown/disabled before
          const hasViewportWidthChanged = prevAdSlotsState.viewportWidth !== window.innerWidth
          const updatedCurrentlyDisabledAdIndices = hasViewportWidthChanged ? updatedViewportAdIndices : prevAdSlotsState.currentlyDisabledAdIndices
          return {
            visibleAdIndex: null,
            viewportAdIndices: updatedViewportAdIndices,
            shownAdIndices: prevShownAdIndices,
            currentlyDisabledAdIndices: updatedCurrentlyDisabledAdIndices,
            viewportWidth: window.innerWidth
          }
        })
      }
    )

    adSlotsRefs.current.forEach((slot) => {
      if (slot) observer.observe(slot)
    })

    // Cleanup-Funktion
    return () => {
      adSlotsRefs.current.forEach((slot) => {
        if (slot) observer.unobserve(slot)
      })
    }
  }, [])

  return adSlotsState;
}

export default adSlotsObserver