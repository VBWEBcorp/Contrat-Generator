import { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Contrats() {
  const [contrats] = useState([
    {
      id: 1,
      client: 'Victor BEASSE',
      type: 'Prestation de service',
      date: '23/02/2024',
      montant: '5000€',
      statut: 'En cours'
    }
  ]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: 'calc(100vh - 64px)',
      p: { xs: 2, sm: 3 },
      backgroundColor: 'background.default'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        gap: 2,
        flexWrap: { xs: 'wrap', sm: 'nowrap' }
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Contrats
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#264060',
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#1a2f47'
            }
          }}
        >
          Nouveau contrat
        </Button>
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          width: '100%',
          height: 'calc(100% - 80px)',
          borderRadius: 2,
          overflow: 'auto',
          backgroundColor: 'background.paper'
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contrats.map((contrat) => (
              <TableRow
                key={contrat.id}
                sx={{
                  transition: 'background-color 0.2s',
                  cursor: 'pointer'
                }}
              >
                <TableCell>{contrat.client}</TableCell>
                <TableCell>{contrat.type}</TableCell>
                <TableCell>{contrat.date}</TableCell>
                <TableCell>{contrat.montant}</TableCell>
                <TableCell>{contrat.statut}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Contrats;
