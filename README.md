# Ecommerce Backend

Este proyecto implementa un backend para una aplicación de ecommerce con autenticación y autorización de usuarios utilizando JWT, Passport y MongoDB.

## Características

- CRUD completo de usuarios
- Sistema de autenticación con JWT
- Estrategias de Passport (local, JWT y current)
- Encriptación de contraseñas con bcrypt
- Gestión de productos y carritos
- Interfaz de usuario con Handlebars
- Escalabilidad con MongoDB

## Requisitos

- Node.js (v14 o superior)
- MongoDB (local o remoto)
- npm o yarn

## Instalación

1. Clona este repositorio:
```
git clone https://github.com/MarraTX/backend2-entrega.git
```

2. Instala las dependencias:
```
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce_new
JWT_SECRET=tu_clave_secreta_jwt
COOKIE_SECRET=tu_clave_secreta_cookies
```

4. Inicia el servidor:
```
npm run dev
```

## Estructura del Proyecto

- `/src`: Código fuente del proyecto
  - `/config`: Configuraciones (Passport, etc.)
  - `/controllers`: Controladores para manejar la lógica de negocio
  - `/models`: Modelos de datos (Mongoose)
  - `/routes`: Rutas de la API
  - `/views`: Plantillas Handlebars
- `/public`: Archivos estáticos (CSS, JS, imágenes)

## Rutas API

### Usuarios
- `GET /api/users`: Obtener todos los usuarios (admin)
- `GET /api/users/:id`: Obtener usuario por ID
- `POST /api/users`: Crear nuevo usuario (admin)
- `PUT /api/users/:id`: Actualizar usuario
- `DELETE /api/users/:id`: Eliminar usuario (admin)

### Sesiones
- `POST /api/sessions/register`: Registrar nuevo usuario
- `POST /api/sessions/login`: Iniciar sesión
- `POST /api/sessions/logout`: Cerrar sesión
- `GET /api/sessions/current`: Obtener usuario actual

### Productos
- `GET /api/products`: Obtener todos los productos
- `GET /api/products/:id`: Obtener producto por ID
- `POST /api/products`: Crear nuevo producto (admin)
- `PUT /api/products/:id`: Actualizar producto (admin)
- `DELETE /api/products/:id`: Eliminar producto (admin)

### Carritos
- `POST /api/carts`: Crear nuevo carrito
- `GET /api/carts/:id`: Obtener carrito por ID
- `POST /api/carts/:cid/product/:pid`: Agregar producto al carrito
- `DELETE /api/carts/:cid/product/:pid`: Eliminar producto del carrito
- `PUT /api/carts/:cid`: Actualizar carrito
- `PUT /api/carts/:cid/product/:pid`: Actualizar cantidad de producto
- `DELETE /api/carts/:cid`: Vaciar carrito

## Licencia

ISC
