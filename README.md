# Inventory App / Práctica Despliegue en AWS. 

Aplicación de inventario de productos – proyecto de prueba y despliegue.

------------------------------------------------------------------------

📂 Contenido del repositorio

-   server.js — Servidor principal implementado en Node.js.
-   package.json & package-lock.json — Gestión de dependencias y
    scripts.
-   public/ — Archivos estáticos (frontend o assets) servidos por el
    servidor.
-   node_modules/ — Dependencias instaladas (no versionadas).
-   LICENSE — Licencia MIT.

------------------------------------------------------------------------

⚙️ Requisitos

-   Node.js (versión 14+ recomendada)
-   npm (gestor de paquetes de Node.js, incluido con Node.js)
-   Git (para clonar el repositorio)

------------------------------------------------------------------------

🚀 Instalación y puesta en marcha

1.  Clonar el repositorio

        git clone https://github.com/josecastineiras/inventory.git
        cd inventory

2.  Instalar dependencias

        npm install

3.  Iniciar la aplicación

    -   En primer plano (mantiene la terminal ocupada):

            npm run start

    -   En segundo plano (útil para servidores o despliegues):

            nohup npm run start > inventory.log 2>&1 &

4.  Verificar que está corriendo

    -   Revisar logs:

            tail -f inventory.log

    -   Verificar proceso activo:

            ps aux | grep node

------------------------------------------------------------------------

🌐 Uso

La aplicación corre en el puerto 3001 por defecto.
Podés comprobar que está funcionando con:

    curl http://localhost:3001

Si corrés la aplicación en un servidor remoto (ejemplo AWS EC2),
asegurate de que el Security Group permita tráfico entrante en el puerto
3001.

-----------------------------------------------------------------------
