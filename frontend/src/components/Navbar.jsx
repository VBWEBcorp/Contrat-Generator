import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';

function Navbar() {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}
        >
          Contrat Generator
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/clients"
            startIcon={<PeopleIcon />}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)' 
              },
              borderRadius: 2,
              px: 2
            }}
          >
            Clients
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/contrats"
            startIcon={<DescriptionIcon />}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)' 
              },
              borderRadius: 2,
              px: 2
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
