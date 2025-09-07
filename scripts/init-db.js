const { testConnection, initializeDatabase, closePool } = require('../config/database');

async function main() {
  console.log('Inicializando base de datos PostgreSQL...');

  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('No se pudo conectar a PostgreSQL');
    console.error('Asegúrate de que PostgreSQL esté corriendo y que las credenciales sean correctas');
    process.exit(1);
  }

  const isInitialized = await initializeDatabase();
  if (!isInitialized) {
    console.error('Error inicializando la base de datos');
    process.exit(1);
  }

  console.log('Base de datos PostgreSQL lista!');
  console.log('Puedes conectarte con pgAdmin usando:');
  console.log('- Host: localhost');
  console.log('- Puerto: 5432');
  console.log('- Base de datos: inventory_db');
  console.log('- Usuario: postgres');
  
  await closePool();
}

if (require.main === module) {
  main();
}

module.exports = main;
