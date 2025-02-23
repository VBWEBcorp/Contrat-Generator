import { Box, Paper, Typography, Grid, Button, TextField } from '@mui/material';

const ContractPreview = ({ contract, client, onEdit }) => {
  const pages = [
    {
      title: 'Contrat de référencement',
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center">
            Contrat de référencement
          </Typography>
          <Typography variant="h6" gutterBottom>
            Entre les soussignés :
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                Le prestataire :<br />
                Victor BEASSE<br />
                3 allée beau rivage<br />
                35690 Acigné<br />
                Tél: +33 (6) 61 64 12 57<br />
                Email: contact@vbweb.fr<br />
                SIRET: 918 936 139 00016
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" gutterBottom>
                Le client :<br />
                {client?.name}<br />
                {client?.address}<br />
                Tél: {client?.phone}<br />
                Email: {client?.email}<br />
                SIRET: {client?.siret}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              {contract.title || "Titre du contrat"}
            </Typography>
            <Typography variant="body1">
              {contract.description || "Description du contrat"}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      title: 'Conditions générales de services',
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Conditions générales de services
          </Typography>
          <Typography variant="body1" paragraph>
            {contract.conditions || `
              Article 1 : Objet du contrat
              Le présent contrat a pour objet de définir les conditions dans lesquelles le prestataire fournira au client des prestations de référencement.

              Article 2 : Durée du contrat
              Le présent contrat est conclu pour une durée de 12 mois à compter de sa signature.

              Article 3 : Prix et modalités de paiement
              Le prix des prestations est fixé à [montant] € HT par mois.
              
              Article 4 : Obligations du prestataire
              Le prestataire s'engage à mettre en œuvre tous les moyens nécessaires pour optimiser le référencement du site web du client.
            `}
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="body2">Signature du prestataire :</Typography>
              <Box sx={{ mt: 2, width: 200, height: 100, border: '1px solid #ccc' }} />
            </Box>
            <Box>
              <Typography variant="body2">
                Signature du client précédée de la mention "Lu et approuvé" :
              </Typography>
              <Box sx={{ mt: 2, width: 200, height: 100, border: '1px solid #ccc' }} />
            </Box>
          </Box>
        </Box>
      )
    },
    {
      title: 'Détail des prestations',
      content: (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom align="center">
            Détail des prestations
          </Typography>
          <Typography variant="body1" paragraph>
            {contract.details || `
              1. Audit initial
              - Analyse technique du site
              - Analyse des mots-clés
              - Analyse de la concurrence

              2. Optimisations techniques
              - Optimisation de la structure du site
              - Amélioration des temps de chargement
              - Optimisation pour mobile

              3. Création de contenu
              - Rédaction de contenus optimisés
              - Optimisation des balises meta
              - Création de liens internes

              4. Suivi et reporting
              - Suivi mensuel des positions
              - Rapport de performance
              - Recommandations d'amélioration
            `}
          </Typography>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      {pages.map((page, index) => (
        <Paper key={index} sx={{ mb: 2, minHeight: '29.7cm' }}>
          <Box sx={{ position: 'relative' }}>
            {page.content}
            <Typography 
              variant="body2" 
              sx={{ 
                position: 'absolute', 
                bottom: 10, 
                right: 10,
                color: 'text.secondary' 
              }}
            >
              Page {index + 1} / {pages.length}
            </Typography>
          </Box>
        </Paper>
      ))}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onEdit}>
          Modifier
        </Button>
        <Button variant="contained">
          Télécharger
        </Button>
      </Box>
    </Box>
  );
};

export default ContractPreview;
