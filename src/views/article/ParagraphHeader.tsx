import React from 'react';
import { Box, Typography } from '@mui/material';

interface AdProps {
  index: number
  text: string
}

const ParagraphHeader: React.FC<AdProps> = ({ index, text }) => {
  return (
    <Box key={index} sx={{ pb: 1 }}>
      <Typography variant='h6' component={'p'} style={{ fontWeight: 'bold' }} data-testid={`paragraphHeader-${index}`}>
        {text}
      </Typography>
    </Box>    
  );
};

export default ParagraphHeader;