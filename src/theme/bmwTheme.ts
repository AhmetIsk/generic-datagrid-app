import { createTheme } from '@mui/material/styles';

/**
 * Custom BMW theme for Material UI
 * Uses the official BMW brand colors for consistent styling
 */
const bmwTheme = createTheme({
  palette: {
    primary: {
      main: '#1c69d4', // BMW blue
      light: '#4e92e9',
      dark: '#0653b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#262626', // BMW black
      light: '#4d4d4d',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc0000', // BMW red
      light: '#ff3333',
      dark: '#b50000',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f9ba00', // BMW warning yellow
      light: '#ffd54f',
      dark: '#c69214',
      contrastText: '#262626',
    },
    info: {
      main: '#1c69d4', // BMW blue (same as primary)
      light: '#4e92e9',
      dark: '#0653b6',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00934a', // BMW green
      light: '#4cb87a',
      dark: '#007339',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#262626',
      secondary: '#4d4d4d',
      disabled: '#8e8e8e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    divider: '#e6e6e6',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 0, // BMW uses sharp corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: '#e6e6e6',
            color: '#8e8e8e',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        standardSuccess: {
          borderLeft: '4px solid #00934a',
        },
        standardError: {
          borderLeft: '4px solid #dc0000',
        },
        standardWarning: {
          borderLeft: '4px solid #f9ba00',
        },
        standardInfo: {
          borderLeft: '4px solid #1c69d4',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default bmwTheme;