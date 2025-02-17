import React, { useRef } from 'react'
import { Typography } from '@mui/material'
import { ARTICLE } from 'src/constants/article'
import Image from 'views/article/Image'
import ParagraphHeader from 'views/article/ParagraphHeader'
import adSlotsObserver from 'src/hooks/adSlotsObserver'
import Paragraph from 'views/article/Paragraph'
import AdSlot from 'views/article/AdSlot'

const ArticleWithAds: React.FC = () => {
  const adSlotsRefs = useRef<(HTMLDivElement | null)[]>([])
  const adSlotsState = adSlotsObserver({ adSlotsRefs: adSlotsRefs })

  return (
    <>
      <Typography variant='caption' sx={{ pb: 10 }} data-testid='category'>
        TECHNOLOGIE
      </Typography>
      <Typography variant='h5' style={{ fontWeight: 'bold' }} sx={{ pb: 1 }} data-testid='title'>
        Baut China im Geheimen gerade einen der größten Kernfusionsreaktoren der Welt?
      </Typography>
      <Typography variant='body1' component={'p'} sx={{ pb: 1 }} data-testid='summary'>
        Die neue Laserfusionsanlage dürfte vor allem für Atomwaffentests relevant sein. Aber auch bei der Energiegewinnung durch Kernfusion zieht China immer weiter voran
      </Typography>

      {ARTICLE.map((c, index) => {
        switch(c.type) {
          case 'paragraph':
            const wasAlreadyVisible = adSlotsState.shownAdIndices.indexOf(index) !== -1
            const isVisible = adSlotsState.visibleAdIndex === index
    
            return (
              <Paragraph key={index} index={index} text={c.text!}>
                <AdSlot index={index} ref={adSlotsRefs} isVisible={isVisible} wasAlreadyVisible={wasAlreadyVisible} />
              </Paragraph>
            )
          case 'paragraphHeader':
            return <ParagraphHeader key={index} index={index} text={c.text!} />
          case 'image':
            return <Image key={index} index={index} url={c.url!} />
          }
      })}
    </>
  )
}

export default ArticleWithAds