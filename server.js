const express = require('express');
const cors = require('cors');
const { pool, testConnection, initializeDatabase } = require('./config/database');

const app = express();
<<<<<<< Updated upstream
const PORT = process.env.PORT || 80;
const HOST = '0.0.0.0';
=======
const PORT = 3001;
>>>>>>> Stashed changes

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function startServer() {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('No se pudo conectar a MySQL');
    process.exit(1);
  }

  const isInitialized = await initializeDatabase();
  if (!isInitialized) {
    console.error('Error inicializando la base de datos');
    process.exit(1);
  }

  console.log('Base de datos lista');
}

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, category, quantity, price, description } = req.body;
    
    if (!name || !category || quantity === undefined || price === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const [result] = await pool.execute(
      'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
      [name, category, quantity, price, description]
    );
    
    res.json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price, description } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE products SET name = ?, category = ?, quantity = ?, price = ?, description = ? WHERE id = ?',
      [name, category, quantity, price, description, id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as total_products,
        SUM(quantity) as total_items,
        COUNT(DISTINCT category) as categories,
        SUM(quantity * price) as total_value
      FROM products
    `);
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});

<<<<<<< Updated upstream
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}${PORT}`);
});
=======
>>>>>>> Stashed changes
