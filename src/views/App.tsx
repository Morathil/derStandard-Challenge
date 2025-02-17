import React from 'react';
import { Container } from '@mui/material';
import Article from 'views/Article'

const App: React.FC = () => {
  return (
    <Container maxWidth='md'>
      <Article />
    </Container>
  );
};

export default App;