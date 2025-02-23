import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const ContractPreview = ({ contract }) => {
  if (!contract) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Aperçu du Contrat
        </Typography>
        
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Numéro de Contrat
                </TableCell>
                <TableCell>{contract.number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Client
                </TableCell>
                <TableCell>{contract.clientName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Type
                </TableCell>
                <TableCell>{contract.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Date de Création
                </TableCell>
                <TableCell>
                  {new Date(contract.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                  Montant
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(contract.amount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {contract.description && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {contract.description}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ContractPreview;
