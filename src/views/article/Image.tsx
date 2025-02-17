import React from 'react';
import { Box } from '@mui/material';

interface AdProps {
  index: number
  url: string
}

const Image: React.FC<AdProps> = ({ index, url }) => {
  return (
  <Box key={index} sx={{ pb: 1 }}>
    <img src={url} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} data-testid={`image-${index}`} />
  </Box>
  );
};

export default Image;