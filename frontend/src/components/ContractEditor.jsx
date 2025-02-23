import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

const ContractEditor = ({ contract, clients, onSave, onPreview }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(contract || {
    clientId: '',
    type: 'referencing',
    title: '',
    description: '',
    conditions: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
  });

  const steps = [
    'Informations générales',
    'Contenu principal',
    'Conditions générales',
    'Détails (optionnel)',
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onSave(formData);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                label="Client"
                required
              >
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Type de contrat</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type de contrat"
                required
              >
                <MenuItem value="referencing">Référencement</MenuItem>
                <MenuItem value="webpackage">Package Web</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Titre du contrat"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Contrat de référencement - Site vitrine"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={6}
              required
              placeholder="Décrivez ici l'objectif principal du contrat..."
            />
          </Box>
        );
      case 2:
        return (
          <TextField
            fullWidth
            label="Conditions générales de services"
            name="conditions"
            value={formData.conditions}
            onChange={handleChange}
            multiline
            rows={12}
            required
            placeholder="Ajoutez ici vos conditions générales de services..."
          />
        );
      case 3:
        return (
          <TextField
            fullWidth
            label="Détails des prestations (optionnel)"
            name="details"
            value={formData.details}
            onChange={handleChange}
            multiline
            rows={12}
            placeholder="Ajoutez ici les détails spécifiques des prestations si nécessaire..."
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return formData.clientId && formData.type && formData.date;
      case 1:
        return formData.title && formData.description;
      case 2:
        return formData.conditions;
      default:
        return true;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {getStepContent(activeStep)}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Précédent
        </Button>
        <Box>
          <Button
            variant="outlined"
            onClick={() => onPreview(formData)}
            sx={{ mr: 1 }}
          >
            Aperçu
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {activeStep === steps.length - 1 ? 'Enregistrer' : 'Suivant'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ContractEditor;
