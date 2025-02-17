import React from 'react';
import { Box, Typography } from '@mui/material';

interface AdProps {
  index: number
  text: string
  children: React.ReactNode
}

const Paragraph: React.FC<AdProps> = ({ index, text, children }) => {
  return (
    <Box key={index}>
      <Typography variant='body1' component={'p'} sx={{ pb: 1 }} data-testid={`paragraph-${index}`}>
        {text}
      </Typography>
      {children} {/* AdSlot */}
    </Box>
  )
}

export default Paragraph;