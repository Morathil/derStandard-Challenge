import React from 'react';
import { Box } from '@mui/material';
import Ad from 'views/article/ad-slot/Ad'

interface AdProps {
  index: number
  isVisible: boolean
  wasAlreadyVisible: boolean
  ref: React.RefObject<(HTMLDivElement | null)[]>
}

const AdSlot: React.FC<AdProps> = ({ index, isVisible, wasAlreadyVisible, ref }) => {
  return (
    <Box ref={(el: any) => { ref.current[index] = el }} sx={{ pb: 1 }} data-testid='ad-slot'>
      {isVisible || wasAlreadyVisible ? <Ad isVisible={isVisible}  /> : null}
    </Box>
  );
};

export default AdSlot;