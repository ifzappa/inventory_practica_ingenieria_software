const { testConnection, initializeDatabase } = require('../config/database');

async function main() {
  console.log('Inicializando base de datos...');

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

  console.log('Base de datos lista!');
}

if (require.main === module) {
  main();
}

module.exports = main;
