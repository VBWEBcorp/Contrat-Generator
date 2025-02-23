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
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
    { label: 'Informations générales', help: 'Sélectionnez le client et le type de contrat' },
    { label: 'Contenu principal', help: 'Définissez le titre et la description du contrat' },
    { label: 'Conditions générales', help: 'Ajoutez les conditions générales de services' },
    { label: 'Détails (optionnel)', help: 'Précisez les détails spécifiques si nécessaire' },
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Titre du contrat"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Contrat de référencement - Site vitrine"
              helperText="Un titre clair et descriptif pour identifier facilement le contrat"
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
              helperText="Détaillez l'objectif, la portée et les livrables principaux"
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
            helperText="Les conditions standard qui s'appliquent à tous vos contrats"
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
            helperText="Précisez les détails techniques, planning, ou toute autre information spécifique"
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
    <Paper sx={{ 
      p: 4,
      maxWidth: '800px',
      mx: 'auto',
      borderRadius: 2,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
          {activeStep === steps.length - 1 ? 'Finaliser le contrat' : steps[activeStep].label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {steps[activeStep].help}
          </Typography>
          <Tooltip title="Aide" arrow>
            <IconButton size="small" color="primary">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 4,
          '& .MuiStepLabel-root .Mui-completed': {
            color: 'primary.main',
          },
          '& .MuiStepLabel-label': {
            mt: 0.5,
          }
        }}
      >
        {steps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {getStepContent(activeStep)}

      <Box sx={{ 
        mt: 4, 
        pt: 3,
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<NavigateBeforeIcon />}
          sx={{ minWidth: '120px' }}
        >
          Précédent
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Voir l'aperçu du contrat" arrow>
            <Button
              variant="outlined"
              onClick={() => onPreview(formData)}
              startIcon={<VisibilityIcon />}
            >
              Aperçu
            </Button>
          </Tooltip>
          <Tooltip title={activeStep === steps.length - 1 ? "Sauvegarder le contrat" : "Étape suivante"} arrow>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed()}
              endIcon={activeStep === steps.length - 1 ? <SaveIcon /> : <NavigateNextIcon />}
              sx={{ minWidth: '120px' }}
            >
              {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {!canProceed() && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Veuillez remplir tous les champs requis pour continuer
        </Alert>
      )}
    </Paper>
  );
};

export default ContractEditor;
