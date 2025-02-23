import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#264060',
    },
    secondary: {
      main: '#4EBAEC',
    },
    background: {
      default: '#264060',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});
