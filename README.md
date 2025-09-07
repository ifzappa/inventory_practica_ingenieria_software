# Inventory App

Aplicación de inventario de productos con PostgreSQL y pgAdmin.

## Archivos

- server.js - Servidor principal
- package.json - Dependencias
- public/ - Archivos del frontend
- config/database.js - Configuración de PostgreSQL
- scripts/init-db.js - Script de inicialización de la base de datos
- pgadmin-config.md - Guía de configuración para pgAdmin

## Requisitos

- Node.js
- PostgreSQL
- pgAdmin (opcional, para administración visual)

## Instalación

1. Instalar dependencias:
   ```
   npm install
   ```

2. Asegúrate de que PostgreSQL esté corriendo en el puerto 5432

3. Inicializar la base de datos:
   ```
   npm run init-db
   ```

4. Ejecutar la aplicación:
   ```
   npm start
   ```

## Uso

La aplicación corre en el puerto 3001.

Para probar:
```
curl http://localhost:3001
```

## Base de datos

Usa PostgreSQL. La configuración está en `config/database.js`.

### Configuración por defecto:
- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: inventory_db
- **Usuario**: postgres
- **Contraseña**: postgres

### Variables de entorno:
Puedes configurar la conexión usando variables de entorno:
- `DB_HOST` - Host de la base de datos
- `DB_USER` - Usuario de la base de datos
- `DB_PASSWORD` - Contraseña de la base de datos
- `DB_NAME` - Nombre de la base de datos
- `DB_PORT` - Puerto de la base de datos

## Administración con pgAdmin

Para administrar la base de datos visualmente, consulta el archivo `pgadmin-config.md` que contiene:
- Instrucciones de configuración de pgAdmin
- Información de conexión
- Consultas útiles
- Solución de problemas

## Estructura de la base de datos

### Tabla: products
- `id` - ID único (SERIAL PRIMARY KEY)
- `name` - Nombre del producto (VARCHAR)
- `category` - Categoría (VARCHAR)
- `quantity` - Cantidad (INTEGER)
- `price` - Precio (DECIMAL)
- `description` - Descripción (TEXT)
- `created_at` - Fecha de creación (TIMESTAMP)
- `updated_at` - Fecha de actualización (TIMESTAMP)

### Características:
- Índices optimizados para búsquedas
- Trigger automático para actualizar `updated_at`
- Datos de ejemplo incluidos
