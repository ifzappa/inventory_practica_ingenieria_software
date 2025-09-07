const { Pool } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'postgres', // Conectar primero a postgres para crear inventory_db
  port: process.env.DB_PORT || 5432,
  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // tiempo máximo para obtener conexión
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbConfig);

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conectado a PostgreSQL');
    client.release();
    return true;
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
    return false;
  }
}

async function initializeDatabase() {
  try {
    // Crear la base de datos inventory_db si no existe
    await pool.query('CREATE DATABASE inventory_db');
    console.log('Base de datos inventory_db creada');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('Base de datos inventory_db ya existe');
    } else {
      console.error('Error creando la base de datos:', error.message);
      return false;
    }
  }

  // Cerrar la conexión actual y crear una nueva para inventory_db
  await pool.end();
  
  // Crear nueva configuración para inventory_db
  const inventoryDbConfig = {
    ...dbConfig,
    database: 'inventory_db'
  };
  
  const inventoryPool = new Pool(inventoryDbConfig);
  
  try {
    // Crear la tabla de productos
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await inventoryPool.query(createTableQuery);

    // Crear índices para mejorar el rendimiento
    await inventoryPool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)
    `);
    await inventoryPool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)
    `);
    await inventoryPool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)
    `);

    // Crear función para actualizar updated_at automáticamente
    await inventoryPool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Crear trigger para actualizar updated_at
    await inventoryPool.query(`
      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    // Verificar si hay productos existentes
    const result = await inventoryPool.query('SELECT COUNT(*) as count FROM products');
    if (parseInt(result.rows[0].count) === 0) {
      console.log('Insertando datos de ejemplo...');
      const sampleProducts = [
        ['Laptop Pro', 'Electronics', 15, 1299.99, 'High-performance laptop for professionals'],
        ['Wireless Mouse', 'Electronics', 45, 29.99, 'Ergonomic wireless mouse with precision tracking'],
        ['Office Chair', 'Furniture', 8, 199.99, 'Comfortable ergonomic office chair'],
        ['Coffee Beans', 'Food', 120, 12.99, 'Premium organic coffee beans'],
        ['Notebook Set', 'Office Supplies', 200, 8.99, 'Pack of 3 high-quality notebooks'],
        ['Monitor 24"', 'Electronics', 12, 249.99, '24-inch Full HD monitor'],
        ['Desk Lamp', 'Furniture', 25, 45.99, 'LED desk lamp with adjustable brightness'],
        ['Pen Set', 'Office Supplies', 150, 15.99, 'Professional pen set with 5 different colors']
      ];

      for (const product of sampleProducts) {
        await inventoryPool.query(
          'INSERT INTO products (name, category, quantity, price, description) VALUES ($1, $2, $3, $4, $5)',
          product
        );
      }
      console.log('Datos de ejemplo insertados correctamente');
    }

    console.log('Base de datos PostgreSQL inicializada correctamente');
    
    // Actualizar el pool global para usar inventory_db
    Object.assign(pool, inventoryPool);
    
    return true;
  } catch (error) {
    console.error('Error inicializando la base de datos:', error.message);
    return false;
  }
}

// Función para cerrar el pool de conexiones
async function closePool() {
  try {
    await pool.end();
    console.log('Pool de conexiones cerrado');
  } catch (error) {
    console.error('Error cerrando el pool:', error.message);
  }
}

// Función para obtener estadísticas de la base de datos
async function getDatabaseStats() {
  try {
    const result = await pool.query(`
      SELECT 
        schemaname as table_schema,
        tablename as table_name,
        n_tup_ins as row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_tables pt
      LEFT JOIN pg_stat_user_tables pst ON pt.tablename = pst.relname
      WHERE schemaname = 'public'
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error.message);
    return [];
  }
}

// Función para verificar el estado de la conexión
async function getConnectionStatus() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 as status');
    client.release();
    return { status: 'connected', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'disconnected', error: error.message, timestamp: new Date().toISOString() };
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  closePool,
  getDatabaseStats,
  getConnectionStatus
};
