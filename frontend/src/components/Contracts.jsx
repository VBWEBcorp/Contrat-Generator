import { useState, useMemo } from 'react';
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
  IconButton,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useApp } from '../context/AppContext';
import { generateContractPDF } from '../utils/pdfGenerator';
import ContractEditor from './ContractEditor';
import ContractPreview from './ContractPreview';

const Contracts = () => {
  const { clients, contracts, addContract, updateContract, deleteContract } = useApp();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('edit');
  const [currentContract, setCurrentContract] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);

  // États pour les filtres
  const [filters, setFilters] = useState({
    number: '',
    clientName: '',
    type: '',
  });

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      number: '',
      clientName: '',
      type: '',
    });
  };

  // Fonction pour mettre à jour les filtres
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrer les contrats
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const numberMatch = contract.number.toLowerCase().includes(filters.number.toLowerCase());
      const clientMatch = contract.clientName.toLowerCase().includes(filters.clientName.toLowerCase());
      const typeMatch = !filters.type || contract.type === filters.type;

      return numberMatch && clientMatch && typeMatch;
    });
  }, [contracts, filters]);

  const handleCreateContract = () => {
    setCurrentContract({
      clientId: '',
      type: 'referencing',
      title: '',
      description: '',
      conditions: '',
      details: '',
      date: new Date().toISOString().split('T')[0],
      number: `CONTRACT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`
    });
    setMode('edit');
    setOpen(true);
  };

  const handleEditContract = (contract) => {
    setCurrentContract(contract);
    setMode('edit');
    setOpen(true);
  };

  const handleDeleteClick = (contract) => {
    setContractToDelete(contract);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      deleteContract(contractToDelete.id);
      setDeleteConfirmOpen(false);
      setContractToDelete(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentContract(null);
  };

  const handleSave = (contractData) => {
    const selectedClient = clients.find(c => c.id === contractData.clientId);
    const contractWithClient = {
      ...contractData,
      clientName: selectedClient.name
    };

    if (currentContract.id) {
      updateContract(currentContract.id, contractWithClient);
    } else {
      addContract(contractWithClient);
    }
    handleClose();
  };

  const handlePreview = (contractData) => {
    setCurrentContract(contractData);
    setMode('preview');
  };

  const handleEdit = () => {
    setMode('edit');
  };

  const handleDownload = (contract) => {
    try {
      const client = clients.find(c => c.id === contract.clientId);
      if (!client) {
        console.error("Client non trouvé pour le contrat:", contract);
        alert("Erreur : Client non trouvé pour ce contrat");
        return;
      }

      const pdfBlob = generateContractPDF(contract, client);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrat_${contract.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateContract}
          sx={{ bgcolor: 'secondary.main' }}
        >
          Nouveau contrat
        </Button>
      </Box>

      {/* Barre de filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Numéro de contrat"
              name="number"
              value={filters.number}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Nom du client"
              name="clientName"
              value={filters.clientName}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type de contrat</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type de contrat"
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="referencing">Référencement</MenuItem>
                <MenuItem value="webpackage">Package Web</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={() => {}}
                fullWidth
              >
                Filtrer
              </Button>
              <IconButton onClick={resetFilters} color="primary">
                <ClearIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.number}</TableCell>
                <TableCell>{contract.date}</TableCell>
                <TableCell>{contract.clientName}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditContract(contract)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(contract)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(contract)}
                    color="primary"
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {mode === 'edit' ? (currentContract?.id ? 'Modifier le contrat' : 'Créer un contrat') : 'Aperçu du contrat'}
        </DialogTitle>
        <DialogContent>
          {mode === 'edit' ? (
            <ContractEditor
              contract={currentContract}
              clients={clients}
              onSave={handleSave}
              onPreview={handlePreview}
            />
          ) : (
            <ContractPreview
              contract={currentContract}
              client={clients.find(c => c.id === currentContract?.clientId)}
              onEdit={handleEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contracts;
