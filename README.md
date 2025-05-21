# Ecommerce Backend

Este proyecto implementa un backend para una aplicación de ecommerce con autenticación y autorización de usuarios utilizando JWT, Passport, MongoDB y envío de correos con SendGrid.

## Características

- CRUD completo de usuarios
- Sistema de autenticación con JWT y cookies HttpOnly
- Estrategias de Passport (local, JWT y current para obtener datos del usuario desde el token)
- Encriptación de contraseñas con bcrypt
- Gestión de productos y carritos
- **Flujo de compra completo:**
  - Verificación de stock antes de la compra.
  - Generación de tickets únicos por cada transacción exitosa.
  - Actualización automática del stock de productos.
  - Envío de correos electrónicos de confirmación de compra utilizando SendGrid.
  - Los productos no comprados por falta de stock permanecen en el carrito.
- Interfaz de usuario con Handlebars y helpers personalizados.
- Roles de usuario (user, admin) con autorización para ciertas rutas/acciones.
- Estructura con DAO, DTO y Repositories para la capa de persistencia de usuarios.

## Requisitos

- Node.js (v14 o superior)
- MongoDB (local o remoto)
- npm o yarn
- Una cuenta de SendGrid para el envío de correos.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/MarraTX/backend2-entrega.git
   cd backend2-entrega
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce_new
   JWT_SECRET=tu_clave_secreta_jwt_muy_segura
   COOKIE_SECRET=tu_clave_secreta_para_cookies_muy_segura
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx # Reemplaza con tu API Key de SendGrid
   SENDGRID_FROM_EMAIL=tu_email_verificado@example.com # Reemplaza con tu email verificado en SendGrid
   ```
   **Nota:** Asegúrate de que `SENDGRID_FROM_EMAIL` sea una dirección de correo electrónico que hayas verificado como "Single Sender" en tu cuenta de SendGrid.

4. Inicia el servidor:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000` (o el puerto que hayas configurado).

## Estructura del Proyecto

- `/src`:
  - `/config`: Configuraciones (Passport, conexión a DB, etc.).
  - `/controllers`: Lógica de negocio para las rutas.
  - `/dao`: Data Access Objects (interacción directa con la base de datos).
  - `/dto`: Data Transfer Objects (para estructurar datos, ej. `UserDTO`).
  - `/middlewares`: Middlewares personalizados (ej. autorización).
  - `/models`: Modelos de Mongoose.
  - `/public`: Archivos estáticos (CSS, JS del cliente, imágenes).
  - `/repositories`: Repositorios (capa de abstracción sobre los DAOs).
  - `/routes`: Definición de rutas de la API y vistas.
  - `/services`: Servicios externos (ej. `email.service.js`).
  - `/utils`: Funciones de utilidad (ej. `bcrypt.js`).
  - `/views`: Plantillas Handlebars.
- `app.js`: Archivo principal de la aplicación Express.

## Flujo de Compra

La aplicación implementa un flujo de compra completo que incluye:
1.  Adición de productos al carrito por parte de un usuario autenticado.
2.  Al proceder al pago desde el carrito, se invoca el endpoint de compra.
3.  El sistema verifica el stock de cada producto en el carrito.
4.  Para los productos con stock suficiente:
    *   Se descuenta la cantidad comprada del stock del producto.
    *   Se calcula el monto de estos productos.
5.  Si al menos un producto pudo ser comprado, se genera un `Ticket` único que registra:
    *   Un código de ticket (UUID).
    *   La fecha y hora de la compra.
    *   El monto total de los productos efectivamente comprados.
    *   El email del comprador (`purchaser`).
6.  Se envía un correo electrónico de confirmación al `purchaser` utilizando SendGrid, detallando los productos comprados, el monto total y el código del ticket. Si hubo productos no procesados, también se informa.
7.  El carrito del usuario se actualiza para contener únicamente los productos que no pudieron ser comprados por falta de stock.
8.  Se devuelve una respuesta al cliente con el ticket generado y los IDs de los productos no comprados.

## Probar el Flujo de Compra

Para probar la funcionalidad de compra:

1.  **Configura SendGrid Correctamente:**
    *   Asegúrate de tener una cuenta activa en SendGrid.
    *   Verifica una dirección de correo electrónico ("Single Sender Verification") en SendGrid. Esta será tu `SENDGRID_FROM_EMAIL`.
    *   Genera una API Key en SendGrid con permisos para enviar correos.
    *   Copia la API Key y el email verificado en las variables `SENDGRID_API_KEY` y `SENDGRID_FROM_EMAIL` de tu archivo `.env`.

2.  **Inicia la Aplicación:** Ejecuta `npm run dev` en tu terminal.

3.  **Regístrate e Inicia Sesión:**
    *   Navega a `http://localhost:PORT/register` para crear una nueva cuenta. Usa una dirección de correo real a la que tengas acceso para recibir la confirmación de compra.
    *   Luego, navega a `http://localhost:PORT/login` para iniciar sesión con tus credenciales.

4.  **Agrega Productos al Carrito:**
    *   Ve a la página de productos (usualmente `http://localhost:PORT/products`).
    *   Agrega uno o más productos a tu carrito. Para una prueba completa, intenta agregar productos con stock suficiente y, si es posible, alguno con stock limitado o cero para ver cómo se maneja.

5.  **Procede al Pago:**
    *   Navega a tu carrito (usualmente `http://localhost:PORT/cart`).
    *   Revisa los productos y haz clic en el botón "Proceder al Pago" (o similar).

6.  **Verifica los Resultados:**
    *   **Frontend:** Deberías ver un mensaje de alerta indicando si la compra fue exitosa, el código del ticket y si algunos productos no se pudieron comprar. Luego serás redirigido.
    *   **Email:** Revisa la bandeja de entrada (y la carpeta de spam/correo no deseado) del correo electrónico con el que te registraste. Deberías recibir un email de confirmación con los detalles de tu compra, el código del ticket y los productos comprados. Si hubo productos no procesados, también se mencionarán.
    *   **Base de Datos (MongoDB):**
        *   Conéctate a tu base de datos `ecommerce_new`.
        *   En la colección `tickets`: busca un nuevo documento con el código de ticket correspondiente. Verifica el `amount`, `purchaser` y `purchase_datetime`.
        *   En la colección `products`: el campo `stock` de los productos comprados debería haber disminuido en la cantidad correcta.
        *   En la colección `carts`: el carrito del usuario (`_id` correspondiente al `cid` de la compra) debería haberse actualizado, conteniendo solo los productos que no se pudieron comprar (si los hubo).
    *   **Consola del Servidor Node.js:** Revisa si hay mensajes de log como "Confirmation email sent to..." o cualquier error inesperado.

## Rutas API

### Usuarios
- `GET /api/users`: Obtener todos los usuarios (requiere rol admin).
- `GET /api/users/:id`: Obtener usuario por ID.
- `POST /api/users`: Crear nuevo usuario (requiere rol admin).
- `PUT /api/users/:id`: Actualizar usuario.
- `DELETE /api/users/:id`: Eliminar usuario (requiere rol admin).

### Sesiones
- `POST /api/sessions/register`: Registrar un nuevo usuario.
- `POST /api/sessions/login`: Iniciar sesión y establecer cookie JWT.
- `POST /api/sessions/logout`: Cerrar sesión y limpiar cookie.
- `GET /api/sessions/current`: Obtener datos del usuario actual a partir del token JWT (protegido).

### Productos
- `GET /api/products`: Obtener todos los productos (con paginación, filtros y ordenamiento).
- `GET /api/products/:id`: Obtener producto por ID.
- `POST /api/products`: Crear nuevo producto (requiere rol admin).
- `PUT /api/products/:id`: Actualizar producto (requiere rol admin).
- `DELETE /api/products/:id`: Eliminar producto (requiere rol admin).

### Carritos
- `POST /api/carts`: Crear nuevo carrito.
- `GET /api/carts/:cid`: Obtener carrito por ID con productos populados.
- `POST /api/carts/:cid/product/:pid`: Agregar un producto al carrito o incrementar su cantidad.
- `DELETE /api/carts/:cid/product/:pid`: Eliminar un producto específico del carrito.
- `PUT /api/carts/:cid`: Actualizar el carrito completo con un nuevo array de productos.
- `PUT /api/carts/:cid/product/:pid`: Actualizar la cantidad de un producto específico en el carrito.
- `DELETE /api/carts/:cid`: Vaciar todos los productos del carrito.
- `POST /api/carts/:cid/purchase`: Finalizar la compra del carrito especificado.

## Licencia

ISC
