# Configuración de pgAdmin para el Proyecto de Inventario

## Información de Conexión

Para conectarte a la base de datos PostgreSQL desde pgAdmin, usa los siguientes datos:

### Configuración del Servidor
- **Nombre del Servidor**: Inventory Database
- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: inventory_db
- **Usuario**: postgres
- **Contraseña**: admin

## Pasos para Configurar pgAdmin

1. **Abrir pgAdmin**
   - Inicia pgAdmin desde el menú de aplicaciones

2. **Crear Nueva Conexión**
   - Haz clic derecho en "Servers" en el panel izquierdo
   - Selecciona "Create" > "Server..."

3. **Configurar la Conexión**
   - En la pestaña "General":
     - Name: `Inventory Database`
   - En la pestaña "Connection":
     - Host name/address: `localhost`
     - Port: `5432`
     - Maintenance database: `inventory_db`
     - Username: `postgres`
     - Password: `admin`

4. **Guardar y Conectar**
   - Haz clic en "Save" para guardar la configuración
   - La conexión se establecerá automáticamente

## Estructura de la Base de Datos

### Tabla: products
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Índices
- `idx_products_category` - Para búsquedas por categoría
- `idx_products_name` - Para búsquedas por nombre
- `idx_products_created_at` - Para ordenamiento por fecha

### Triggers
- `update_products_updated_at` - Actualiza automáticamente el campo `updated_at` cuando se modifica un registro

## Consultas Útiles

### Ver todos los productos
```sql
SELECT * FROM products ORDER BY created_at DESC;
```

### Estadísticas del inventario
```sql
SELECT 
    COUNT(*) as total_products,
    SUM(quantity) as total_items,
    COUNT(DISTINCT category) as categories,
    SUM(quantity * price) as total_value
FROM products;
```

### Productos por categoría
```sql
SELECT category, COUNT(*) as count, SUM(quantity) as total_quantity
FROM products 
GROUP BY category 
ORDER BY count DESC;
```

## Solución de Problemas

### Error de Conexión
- Verifica que PostgreSQL esté corriendo
- Comprueba que el puerto 5432 esté disponible
- Confirma las credenciales de usuario

### Error de Base de Datos No Encontrada
- Ejecuta el script de inicialización: `npm run init-db`
- Verifica que la base de datos `inventory_db` exista

### Error de Permisos
- Asegúrate de que el usuario `postgres` tenga permisos para acceder a la base de datos
- Verifica la configuración de `pg_hba.conf` si es necesario
