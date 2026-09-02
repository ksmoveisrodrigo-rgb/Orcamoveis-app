const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 26641,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send('API OrçaMóveis Online!');
});

app.post('/api/orcamento', (req, res) => {
  const { cliente, custo, markup } = req.body;
  const valorFinal = custo * (1 + markup / 100);

  const query = 'INSERT INTO orcamentos (cliente_nome, valor_custo, markup, valor_final) VALUES (?, ?, ?, ?)';
  db.query(query, [cliente, custo, markup, valorFinal], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro no banco' });
    res.json({ id: result.insertId, cliente, custo, markup, valorFinal });
  });
});

app.get('/api/orcamentos', (req, res) => {
  db.query('SELECT * FROM orcamentos ORDER BY data_criacao DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar dados' });
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
