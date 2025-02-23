import { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useApp } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL;

const Clients = () => {
  const { clients, addClient } = useApp();
  const [open, setOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    siret: '',
    address: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddClient = () => {
    setOpen(true);
    setNewClient({
      name: '',
      siret: '',
      address: '',
      email: '',
      phone: ''
    });
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'siret') {
      setError('');
    }
  };

  const handleSave = () => {
    if (newClient.name && newClient.siret) {
      addClient(newClient);
      handleClose();
    }
  };

  const searchCompany = async () => {
    if (!newClient.siret) {
      setError('Veuillez entrer un numéro SIRET');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/search-company?siret=${newClient.siret}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la recherche');
      }

      setNewClient(prev => ({
        ...prev,
        name: data.name || prev.name,
        address: data.address || prev.address,
        email: data.email || prev.email,
        phone: data.phone || prev.phone
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClient}
          sx={{ bgcolor: 'secondary.main' }}
        >
          Nouveau client
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>SIRET</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.siret}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ajouter un client</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              label="SIRET"
              name="siret"
              value={newClient.siret}
              onChange={handleInputChange}
              error={!!error}
              helperText={error}
            />
            <Tooltip title="Rechercher les informations de l'entreprise">
              <IconButton 
                onClick={searchCompany}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : <SearchIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          
          <TextField
            fullWidth
            label="Nom"
            name="name"
            value={newClient.name}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Adresse"
            name="address"
            value={newClient.address}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={newClient.email}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Téléphone"
            name="phone"
            value={newClient.phone}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" disabled={!newClient.name || !newClient.siret}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clients;
