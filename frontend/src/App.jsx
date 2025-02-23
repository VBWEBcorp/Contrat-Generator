import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Navbar from './components/Navbar';
import Contracts from './components/Contracts';
import Clients from './components/Clients';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Navbar />
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/clients" element={<Clients />} />
              <Route path="/contrats" element={<Contracts />} />
              <Route path="/" element={<Navigate to="/clients" replace />} />
            </Routes>
          </Container>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
