const express = require('express');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'secreto-taller-superseguro';

app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';
const ORDERS_FILE = './orders.json';

// Helper: Read and write users
function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return data ? JSON.parse(data) : [];
}
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Helper: Read and write orders
function readOrders() {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return data ? JSON.parse(data) : [];
}
function writeOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Middleware: check JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.user = user;
        next();
    });
}
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden crear usuarios.' });
    }
    next();
}

// --- RUTAS DE AUTENTICACIÓN ---

// Registro de talleristas (solo admin)
app.post('/api/register', authenticateToken, isAdmin, async (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Usuario ya existe' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = { username, password: hashed, role: 'tallerista' };
    users.push(user);
    writeUsers(users);
    res.json({ success: true });
});

// Ruta para crear primer admin manualmente (usa solo una vez)
app.post('/api/register-admin', async (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Usuario ya existe' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = { username, password: hashed, role: 'admin' };
    users.push(user);
    writeUsers(users);
    res.json({ success: true, admin: username });
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    let users = readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });
    const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '8h' });
    res.json({ token });
});

// --- RUTAS DE ÓRDENES ---

// Crear nueva orden (público)
app.post('/api/orders', (req, res) => {
    let orders = readOrders();
    const { nombre, apellido, documento, services } = req.body;
    const orderId = (Math.floor(100000 + Math.random() * 900000)).toString();
    const order = {
        id: orderId,
        customer: {
            nombre,
            apellido,
            documento
        },
        services: services.map(service => ({
            name: service,
            status: "Pendiente"
        })),
        currentStep: 0,
        createdAt: new Date(),
        history: []
    };
    orders.push(order);
    writeOrders(orders);
    res.json({ orderId });
});

// Consultar orden (público)
app.get('/api/orders/:orderId', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.orderId);
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(order);
});

// Obtener todas las órdenes (protegido, solo tallerista o admin)
app.get('/api/orders', authenticateToken, (req, res) => {
    const orders = readOrders();
    const { status } = req.query;
    
    let filteredOrders = orders;
    
    // Si se especifica un estado, filtrar por ese estado
    if (status && status !== 'todas') {
        filteredOrders = orders.filter(order => {
            return order.services.some(service => service.status === status);
        });
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(filteredOrders);
});

// Actualizar estado de orden (protegido, solo tallerista o admin)
app.put('/api/orders/:orderId', authenticateToken, (req, res) => {
    let orders = readOrders();
    const order = orders.find(o => o.id === req.params.orderId);
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });

    const { serviceIndex, status } = req.body;
    if (serviceIndex < 0 || serviceIndex >= order.services.length) {
        return res.status(400).json({ error: "Índice de servicio inválido" });
    }
    order.services[serviceIndex].status = status;
    order.history.push({
        timestamp: new Date(),
        service: order.services[serviceIndex].name,
        status: status,
        usuario: req.user.username
    });
    writeOrders(orders);
    res.json({ success: true, order });
});

app.listen(PORT, () => {
    console.log(`Servidor backend autenticado en http://localhost:${PORT}`);
});