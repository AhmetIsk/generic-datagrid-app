import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AppBar, Box, Container, Toolbar, Typography, CssBaseline } from '@mui/material';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ServerSideRowModelModule } from 'ag-grid-enterprise';
import 'ag-grid-enterprise';

import DataGridPage from './pages/DataGridPage';
import { DetailPage } from './pages/DetailPage';
import bmwTheme from './theme/bmwTheme';

// Register all required AG Grid modules
ModuleRegistry.registerModules([
  AllCommunityModule,
  ServerSideRowModelModule
]);

// Styles for the App component
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  appHeader: {
    backgroundColor: '#262626',
    padding: '0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerIcon: {
    marginRight: '16px',
    color: '#1c69d4',
    fontSize: '1.6rem'
  },
  headerTitle: {
    fontWeight: 500,
    color: '#ffffff',
    fontSize: '1.2rem'
  },
  mainContent: {
    marginTop: '32px',
    marginBottom: '32px',
    flexGrow: 1
  },
  footer: {
    paddingTop: '24px',
    paddingBottom: '24px',
    backgroundColor: '#262626',
    color: '#ffffff',
    marginTop: 'auto'
  },
  footerText: {
    textAlign: 'center',
    fontWeight: 500
  },
  footerSubText: {
    display: 'block',
    marginTop: '8px',
    color: '#8e8e8e',
    textAlign: 'center'
  }
};

function App() {
  return (
    <ThemeProvider theme={bmwTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={styles.appContainer}>
          {/* Header */}
          <AppBar position="static" sx={styles.appHeader}>
            <Toolbar>
              <ElectricCarIcon sx={styles.headerIcon} />
              <Typography variant="h6" component="div" sx={styles.headerTitle}>
                BMW Electric Vehicle DataGrid
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container maxWidth="xl" sx={styles.mainContent}>
            <Routes>
              <Route path="/" element={<DataGridPage />} />
              <Route path="/detail/:id" element={<DetailPage />} />
            </Routes>
          </Container>

          {/* Footer */}
          <Box component="footer" sx={styles.footer}>
            <Container maxWidth="lg">
              <Typography variant="body2" sx={styles.footerText}>
                BMW Electric Vehicle DataGrid Example © {new Date().getFullYear()}
              </Typography>
              <Typography variant="caption" sx={styles.footerSubText}>
                Powered by BMW's commitment to sustainable mobility
              </Typography>
            </Container>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
