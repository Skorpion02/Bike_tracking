# Bike Tracking

![GitHub Repo stars](https://img.shields.io/github/stars/Skorpion02/Bike_tracking?style=social)
![GitHub forks](https://img.shields.io/github/forks/Skorpion02/Bike_tracking?style=social)
![GitHub issues](https://img.shields.io/github/issues/Skorpion02/Bike_tracking)
![GitHub last commit](https://img.shields.io/github/last-commit/Skorpion02/Bike_tracking)
![GitHub license](https://img.shields.io/github/license/Skorpion02/Bike_tracking)

---

## 🚲 Bike Tracking

**Bike Tracking** es un sistema sencillo para crear y rastrear órdenes de reparación en un taller, con autenticación para talleristas y administración de usuarios. Ideal para digitalizar la gestión de servicios de un taller de bicicletas.

---

## ✨ Características

- 📋 Creación de órdenes por parte de clientes seleccionando los servicios a realizar
- 🔢 Generación de número de orden único por cada solicitud
- 🔎 Consulta de estado y avance de la orden mediante el número único
- 🛠️ Talleristas pueden actualizar el estado de cada servicio (Pendiente, En proceso, Terminado)
- 🕓 Historial de cambios con registro de usuario y fecha
- 🔐 Autenticación por roles: tallerista y administrador
- 🧑‍💼 Panel de administración para registrar nuevos usuarios talleristas
- 🛡️ Creación segura del primer usuario admin mediante endpoint especial

---

## 🚀 Demo

_Pendiente implementación de demo en vivo_

---

## 📦 Estructura del Proyecto

```
Bike_tracking/
├── backend/
│   ├── server.js
│   ├── orders.json
│   ├── users.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
├── package-lock.json
├── package.json
└── README.md
```

---

## 🛠️ Instalación local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Skorpion02/Bike_tracking.git
   cd Bike_tracking
   ```

2. **Instala las dependencias del backend**
   ```bash
   cd backend
   npm install express cors jsonwebtoken bcryptjs
   node server.js
   ```

3. **Abre el frontend**
   - Abre `frontend/index.html` en tu navegador (puedes usar Live Server para evitar problemas de CORS).

---

## 👤 Primer uso: Crear el usuario administrador

Realiza una petición POST a:

```
POST http://localhost:3000/api/register-admin
Content-Type: application/json

{
  "username": "admin",
  "password": "tu_clave_segura"
}
```

Puedes hacerlo usando [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/) o un formulario temporal.

> Una vez creado el admin, inicia sesión en el frontend. Solo los admin podrán registrar nuevos talleristas.

---

## 🧰 Tecnologías usadas

- Node.js
- Express
- CORS
- JWT (jsonwebtoken)
- BcryptJS
- HTML5, CSS3
- JavaScript

---

## 🔒 Seguridad

- Autenticación mediante tokens JWT
- Registro de usuarios protegido por roles
- Endpoint de creación de admin solo para configuración inicial

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 🤝 Contribuciones

¡Contribuciones, issues y sugerencias son bienvenidas!  
No dudes en abrir un issue o un pull request.

---

## 📬 Contacto

Para dudas o sugerencias, abre un issue o contacta a través de [Skorpion02](https://github.com/Skorpion02).

---

⭐️ **Si te gustó este proyecto, ¡déjale una estrella!**

---

<div align="center">
  <b>Hecho con ❤️ por Skorpion02</b>
</div>
