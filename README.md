# Workshop Tracking

Sistema sencillo para crear y rastrear órdenes de reparación en un taller, con autenticación para talleristas y administración de usuarios.

---

## Características

- **Clientes** pueden crear órdenes seleccionando los servicios a realizar.
- El sistema genera un **número de orden único** por cada solicitud.
- Los clientes pueden consultar el **estado** de su orden usando ese número.
- Los **talleristas** pueden actualizar el estado de cada servicio de una orden (Pendiente, En proceso, Terminado).
- **Historial** de cambios y usuarios que realizaron cada actualización.
- **Autenticación por roles**: solo los usuarios con rol "tallerista" pueden actualizar órdenes; solo los usuarios con rol "admin" pueden crear nuevos talleristas.
- **Panel de administración** simple: un administrador puede registrar nuevos usuarios talleristas.
- **Primer usuario admin**: Se puede crear mediante una ruta especial pensada para configuraciones iniciales.

---

## Estructura de carpetas

```
workshop-tracking/
├── backend/
│   ├── server.js
│   ├── orders.json
│   ├── users.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
├── README.md
```

---

## Instalación rápida

### 1. Backend

1. Ingresa a la carpeta `backend`
2. Instala las dependencias:
   ```bash
   npm install express cors jsonwebtoken bcryptjs
   ```
3. Inicia el servidor:
   ```bash
   node server.js
   ```

### 2. Frontend

- Abre `frontend/index.html` en tu navegador (puedes usar Live Server o similar para evitar problemas de CORS en algunos navegadores).

---

## Primer uso: crear el usuario administrador

Antes de poder registrar talleristas, necesitas crear el primer usuario administrador.

Haz una petición POST a:

```
POST http://localhost:3000/api/register-admin
Content-Type: application/json

{
  "username": "admin",
  "password": "tu_clave_segura"
}
```

Puedes hacerlo usando [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), o con un pequeño formulario temporal.

**Una vez creado el admin, inicia sesión en el frontend con ese usuario. Solo los admin verán el formulario de registro de nuevos talleristas.**

---

## Flujo de la aplicación

1. **Clientes:**
   - Crean una orden desde el formulario principal.
   - Reciben un número de orden único.
   - Consultan el estado y avance de su orden desde el frontend.

2. **Talleristas:**
   - Inician sesión con su usuario y contraseña.
   - Consultan órdenes e **indican el avance de cada servicio**.
   - Solo pueden modificar el estado de los servicios si están autenticados correctamente.

3. **Administradores:**
   - Inician sesión con usuario admin.
   - Ven el formulario de registro de nuevos talleristas.
   - Registran nuevos usuarios talleristas desde el frontend.

---

## Actualizar el estado de los servicios

El tallerista (autenticado) puede cambiar el estado de cada servicio dentro de una orden desde el panel de tallerista.  
El historial de cambios muestra quién realizó cada actualización.

---

## Seguridad

- Los tokens JWT aseguran que solo usuarios autenticados puedan actualizar órdenes.
- El registro de nuevos usuarios está **protegido y solo disponible a administradores**.
- El endpoint `/api/register-admin` debe usarse solo una vez para crear el primer admin y luego puede ser eliminado o deshabilitado para mayor seguridad.

---

## Personalización

- Puedes agregar nuevos servicios fácilmente editando el frontend.
- El almacenamiento es local usando archivos JSON para facilitar pruebas; para producción puedes cambiar a una base de datos real.

---

## Créditos

Creado como ejemplo educativo por solicitud de usuario.

---