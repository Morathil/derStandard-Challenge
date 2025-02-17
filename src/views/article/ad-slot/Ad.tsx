import React, { useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Box } from '@mui/material';
import adParallaxScroll from 'src/hooks/adParallaxScroll'

const adContainerMinHeight = 480

interface AdProps {
  isVisible: boolean
}

const Ad: React.FC<AdProps> = ({ isVisible }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const adRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up('sm')); // < 600 px
  const offset = adParallaxScroll({ containerRef, adRef })

  return (
    <Box
      ref={containerRef}
      sx={{
        backgroundColor: 'lightgrey',
        minHeight: isSm ? adContainerMinHeight : window.innerHeight,
        position: 'relative',
        overflow: 'hidden'
        // --- no parallax
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <Box 
        ref={adRef}
        sx={{
          padding: 2,
          backgroundColor: '#eb3b5a',
          height: (isSm ? adContainerMinHeight: window.innerHeight) * 0.8,
          // width: '100%', no parallax
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          willChange: 'transform', // prevent re-painting
          position: 'relative',
          overflow: 'hidden'
        }}
        style={{
          transform: `translateY(${offset}px)`,
        }}
        >
        {/* real ad would most likely run in an iframe which is will only be shown while isVisible otherwise empty frame is prepared if it has already been shown here*/}
        {isVisible ? <Typography variant='h4' data-testid='ad'>Ad</Typography> : null}
      </Box>
    </Box>
  );
};

export default Ad;