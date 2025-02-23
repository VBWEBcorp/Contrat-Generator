import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';

function Navbar() {
  const location = useLocation();

  return (
    <AppBar 
      position="static" 
      elevation={1}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h6" 
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1,
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            letterSpacing: '-0.025em'
          }}
        >
          Contrat Generator
        </Typography>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
          <Button 
            component={Link} 
            to="/clients"
            startIcon={<PeopleIcon />}
            variant={location.pathname === '/clients' ? 'contained' : 'text'}
            color="inherit"
            sx={{ 
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2 },
              ...(location.pathname === '/clients' && {
                bgcolor: 'primary.dark',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              })
            }}
          >
            Clients
          </Button>
          <Button 
            component={Link} 
            to="/contrats"
            startIcon={<DescriptionIcon />}
            variant={location.pathname === '/contrats' ? 'contained' : 'text'}
            color="inherit"
            sx={{ 
              minWidth: 'auto',
              px: { xs: 1.5, sm: 2 },
              ...(location.pathname === '/contrats' && {
                bgcolor: 'primary.dark',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              })
            }}
          >
            Contrats
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
