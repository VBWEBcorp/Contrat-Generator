import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ContratGenerator
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
          >
            Contrats
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate('/clients')}
          >
            Clients
          </Button>

          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
