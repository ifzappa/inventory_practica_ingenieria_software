# Inventory App

Aplicación de inventario de productos.

## Archivos

- server.js - Servidor principal
- package.json - Dependencias
- public/ - Archivos del frontend
- config/database.js - Configuración de MySQL

## Requisitos

- Node.js
- MySQL

## Instalación

1. Instalar dependencias:
   ```
   npm install
   ```

2. Asegurate de que MySQL esté corriendo

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

Usa MySQL. La configuración está en `config/database.js`.

Base de datos: `inventory_db`
Tabla: `products`
