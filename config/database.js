const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventory_db',
  port: 3306
};

const pool = mysql.createPool(dbConfig);

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function initializeDatabase() {
  try {
    await pool.execute(`CREATE DATABASE IF NOT EXISTS inventory_db`);
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await pool.execute(createTableQuery);

    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      const sampleProducts = [
        ['Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop'],
        ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse'],
        ['Office Chair', 'Furniture', 8, 199.99, 'Comfortable office chair'],
        ['Coffee Beans', 'Food', 120, 12.99, 'Premium coffee beans'],
        ['Notebook Set', 'Office Supplies', 200, 8.99, 'Pack of 3 notebooks']
      ];

      for (const product of sampleProducts) {
        await pool.execute(
          'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
          product
        );
      }
    }

    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase
};
