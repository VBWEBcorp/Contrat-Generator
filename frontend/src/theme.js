import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#264060', // Bleu foncé original
      light: '#4EBAEC', // Bleu clair original
      dark: '#1a2f47',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#4EBAEC',
      light: '#7dcbf1',
      dark: '#3594bc',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#264060',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: '#264060',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.9375rem',
        },
        contained: {
          backgroundColor: '#264060',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1a2f47',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          padding: '16px',
          color: '#264060',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#264060',
          color: '#ffffff',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f1f5f9',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#264060',
          color: '#ffffff',
        },
      },
    },
  },
});

export default theme;
