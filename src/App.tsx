import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Box, Container, Toolbar, Typography, CssBaseline } from '@mui/material';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ServerSideRowModelModule } from 'ag-grid-enterprise';
import 'ag-grid-enterprise';

import { DataGridPage } from './pages/DataGridPage';
import { DetailPage } from './pages/DetailPage';

// Register all required AG Grid modules
ModuleRegistry.registerModules([
  AllCommunityModule,
  ServerSideRowModelModule
]);

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Header */}
          <AppBar position="static" color="primary">
            <Toolbar>
              <ElectricCarIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div">
                Electric Vehicle DataGrid
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<DataGridPage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
          </Container>

          {/* Footer */}
          <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                Electric Vehicle DataGrid Example © {new Date().getFullYear()}
              </Typography>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
