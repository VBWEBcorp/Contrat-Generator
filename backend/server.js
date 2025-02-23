require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const auth = require('./middleware/auth');
const inseeApi = require('./services/inseeApi');

const prisma = new PrismaClient();
const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
  origin: ['https://contratgenerator.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes publiques
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
    const client = await prisma.client.create({ data: req.body });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/clients', auth, async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/clients/:id', auth, async (req, res) => {
  try {
    const client = await prisma.client.update({ where: { id: req.params.id }, data: req.body });
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
    const client = await prisma.client.delete({ where: { id: req.params.id } });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    // Test de la connexion Prisma
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
