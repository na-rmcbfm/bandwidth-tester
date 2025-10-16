import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import HistoryIcon from '@mui/icons-material/History';
import { TestPage } from './pages/TestPage';
import { HistoryPage } from './pages/HistoryPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <SpeedIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Bandwidth Test
              </Typography>
              <Button color="inherit" component={Link} to="/" startIcon={<SpeedIcon />}>
                Test
              </Button>
              <Button color="inherit" component={Link} to="/history" startIcon={<HistoryIcon />}>
                History
              </Button>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/" element={<TestPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
