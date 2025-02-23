require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const Client = require('./models/Client');
const auth = require('./middleware/auth');
const inseeApi = require('./services/inseeApi');

const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connexion à la base de données
connectDB();

// Routes publiques
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes protégées
app.get('/api/search-company', auth, async (req, res) => {
  const siret = req.query.siret;
  if (!siret) {
    return res.status(400).json({ error: 'SIRET number is required' });
  }

  try {
    const companyData = await inseeApi.searchCompany(siret);
    res.json(companyData);
  } catch (error) {
    res.status(error.message === 'Entreprise non trouvée' ? 404 : 500)
      .json({ error: error.message });
  }
});

// Routes Clients
app.post('/api/clients', auth, async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/clients', auth, async (req, res) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clients/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/clients/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
