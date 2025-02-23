import React, { useState, useEffect } from 'react'

interface AdSlotState {
  visibleAdIndex: number | null
  currentlyDisabledAdIndices: number[]
  shownAdIndices: number[]
  viewportAdSlotIndices: number[]
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
    viewportAdSlotIndices: [],
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
          const prevViewportAdSlotIndices = prevAdSlotsState.viewportAdSlotIndices
          var updatedViewportAdSlotIndices = Array.from(new Set([...prevViewportAdSlotIndices, ...joinedViewportAdSlotIndizes].filter((adIndex) => leftViewPortAdIndizes.indexOf(adIndex) === -1)))

          const prevVisibleAdIndex = prevAdSlotsState.visibleAdIndex
          var prevShownAdIndices = prevAdSlotsState.shownAdIndices

          // clean up in case of layout change and multiple already shown ad slots are in the same viewport
          const shownAdSlotsInViewport = updatedViewportAdSlotIndices.filter((adIndex) => prevShownAdIndices.indexOf(adIndex) !== -1)
          if (shownAdSlotsInViewport.length > 1 && prevVisibleAdIndex != null) {
            prevShownAdIndices = [prevVisibleAdIndex]
          }

          // early exit as currently shown ad is still in viewport visible
          if (prevVisibleAdIndex != null && updatedViewportAdSlotIndices.indexOf(prevVisibleAdIndex) !== -1) {
            const updatedCurrentlyDisabledAdIndices = Array.from(new Set([...prevAdSlotsState.currentlyDisabledAdIndices, ...updatedViewportAdSlotIndices].filter((adIndex) => adIndex !== prevVisibleAdIndex)))
            return {
              visibleAdIndex: prevVisibleAdIndex,
              viewportAdSlotIndices: updatedViewportAdSlotIndices,
              shownAdIndices: prevShownAdIndices,
              currentlyDisabledAdIndices: updatedCurrentlyDisabledAdIndices,
              viewportWidth: window.innerWidth
            }
          }
          
          // set ad if visible ad-slots are present
          if (updatedViewportAdSlotIndices.length > 0) {
            const availableAdSlots = updatedViewportAdSlotIndices.filter((viewportAdSlot) => prevAdSlotsState.currentlyDisabledAdIndices.indexOf(viewportAdSlot) === -1)

            if (availableAdSlots.length > 0) {
              const newIndex = Math.max(0, Math.floor(availableAdSlots.length / 2) - 1) // take middle value, other options, first, last, - 1 as index
              const newVisibleAdIndex = availableAdSlots[newIndex]
              
              const updatedCurrentlyDisabledAdIndices = Array.from(new Set([...prevAdSlotsState.currentlyDisabledAdIndices, ...updatedViewportAdSlotIndices].filter((adIndex) => adIndex !== newVisibleAdIndex)))
              const updatedShownAdIndices = Array.from(new Set([...prevShownAdIndices, newVisibleAdIndex]))
  
              return {
                visibleAdIndex: newVisibleAdIndex,
                viewportAdSlotIndices: updatedViewportAdSlotIndices,
                shownAdIndices: updatedShownAdIndices,
                currentlyDisabledAdIndices: updatedCurrentlyDisabledAdIndices,
                viewportWidth: window.innerWidth
              }
            }
          }

          // no ad slot shown - if the viewport width changed we should show the next one otherwise we keep the ones we have shown/disabled before
          const hasViewportWidthChanged = prevAdSlotsState.viewportWidth !== window.innerWidth
          const updatedCurrentlyDisabledAdIndices = hasViewportWidthChanged ? updatedViewportAdSlotIndices : prevAdSlotsState.currentlyDisabledAdIndices
          return {
            visibleAdIndex: null,
            viewportAdSlotIndices: updatedViewportAdSlotIndices,
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

    // clean up function
    return () => {
      adSlotsRefs.current.forEach((slot) => {
        if (slot) observer.unobserve(slot)
      })
    }
  }, [])

  return adSlotsState;
}

export default adSlotsObserver