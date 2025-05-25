const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let clients = [];
let commandes = [];
let clientId = 1;
let commandeId = 1;

// Routes Clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.post('/api/clients', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Champs manquants' });
  const client = { id: clientId++, name, email };
  clients.push(client);
  res.status(201).json(client);
});

app.delete('/api/clients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  clients = clients.filter(c => c.id !== id);
  // Supprimer aussi les commandes liées
  commandes = commandes.filter(cmd => cmd.clientId !== id);
  res.json({ message: 'Client supprimé' });
});

// Routes Commandes
app.get('/api/commandes', (req, res) => {
  res.json(commandes);
});

app.get('/api/clients/:id/commandes', (req, res) => {
  const clientId = parseInt(req.params.id);
  const cmds = commandes.filter(cmd => cmd.clientId === clientId);
  res.json(cmds);
});

app.post('/api/commandes', (req, res) => {
  const { clientId, product, quantity } = req.body;
  if (!clientId || !product || !quantity) return res.status(400).json({ error: 'Champs manquants' });
  if (!clients.find(c => c.id === clientId)) return res.status(404).json({ error: 'Client non trouvé' });
  const commande = { id: commandeId++, clientId, product, quantity };
  commandes.push(commande);
  res.status(201).json(commande);
});

app.delete('/api/commandes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  commandes = commandes.filter(cmd => cmd.id !== id);
  res.json({ message: 'Commande supprimée' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
