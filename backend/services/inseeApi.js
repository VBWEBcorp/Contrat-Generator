const axios = require('axios');

class InseeAPI {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    if (this.token && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.token;
    }

    try {
      const response = await axios.post('https://api.insee.fr/token', 
        'grant_type=client_credentials',
        {
          auth: {
            username: process.env.INSEE_KEY,
            password: process.env.INSEE_SECRET
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.token;
    } catch (error) {
      console.error('Erreur lors de l\'obtention du token INSEE:', error);
      throw new Error('Impossible d\'obtenir le token INSEE');
    }
  }

  async searchCompany(siret) {
    try {
      const token = await this.getToken();
      const response = await axios.get(`https://api.insee.fr/entreprises/sirene/V3/siret/${siret}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const establishment = response.data.etablissement;
      
      return {
        name: establishment.uniteLegale.denominationUniteLegale,
        siret: establishment.siret,
        address: `${establishment.adresseEtablissement.numeroVoieEtablissement || ''} ${establishment.adresseEtablissement.typeVoieEtablissement || ''} ${establishment.adresseEtablissement.libelleVoieEtablissement || ''}, ${establishment.adresseEtablissement.codePostalEtablissement} ${establishment.adresseEtablissement.libelleCommuneEtablissement}`,
        // L'API INSEE ne fournit pas ces informations, on les laisse vides
        email: '',
        phone: ''
      };
    } catch (error) {
      console.error('Erreur lors de la recherche d\'entreprise:', error);
      if (error.response?.status === 404) {
        throw new Error('Entreprise non trouvée');
      }
      throw new Error('Erreur lors de la recherche d\'entreprise');
    }
  }
}

module.exports = new InseeAPI();
