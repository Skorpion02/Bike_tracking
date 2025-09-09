const API_URL = "http://localhost:3000/api";

// ----------- REGISTRO DE TALLERISTA -----------
document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUser').value;
    const password = document.getElementById('registerPass').value;
    const token = localStorage.getItem('taller_token');
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
        document.getElementById('registerStatus').textContent = "¡Tallerista registrado correctamente!";
        document.getElementById('registerForm').reset();
    } else {
        document.getElementById('registerStatus').textContent = data.error || "Error en el registro";
    }
};

// ----------- CREAR ORDEN -----------
document.getElementById('orderForm').onsubmit = async function (e) {
    e.preventDefault();
    const customer = document.getElementById('customer').value;
    const services = [...document.querySelectorAll('input[name=service]:checked')].map(cb => cb.value);

    console.log('Datos a enviar:', { customer, services });

    if (services.length === 0) {
        alert("Selecciona al menos un servicio");
        return;
    }

    // Limpiar mensaje anterior
    document.getElementById('orderCreated').innerHTML = '';

    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer, services })
        });
        
        console.log('Respuesta del servidor:', res.status, res.statusText);
        
        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Datos recibidos:', data);
        
        if (data.orderId) {
            // Crear el mensaje de éxito y mantenerlo
            const successMessage = document.createElement('div');
            successMessage.innerHTML = 
                `<div style="background-color: #d4edda; color: #155724; padding: 15px; border: 1px solid #c3e6cb; border-radius: 4px; margin: 15px 0; font-size: 16px;">
                    <strong>✅ ¡Orden creada exitosamente!</strong><br>
                    Tu número de orden es: <strong style="font-size: 20px; color: #0056b3; background-color: #e7f3ff; padding: 5px 10px; border-radius: 3px; display: inline-block; margin: 10px 0;">${data.orderId}</strong><br>
                    <small style="color: #0c5460;">💡 Guarda este número para rastrear tu orden más adelante</small><br>
                    <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background-color: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer;">Cerrar mensaje</button>
                </div>`;
            
            document.getElementById('orderCreated').appendChild(successMessage);
            
            // Resetear SOLO los campos del formulario, no el div del mensaje
            document.getElementById('customer').value = '';
            document.querySelectorAll('input[name="service"]:checked').forEach(cb => cb.checked = false);
            
            // Hacer scroll al mensaje
            document.getElementById('orderCreated').scrollIntoView({ behavior: 'smooth' });
            
            console.log('Mensaje de éxito creado y debería permanecer visible');
        } else {
            document.getElementById('orderCreated').innerHTML = 
                `<div style="background-color: #f8d7da; color: #721c24; padding: 10px; border: 1px solid #f5c6cb; border-radius: 4px; margin: 10px 0;">
                    <strong>❌ Error:</strong> ${data.error || 'No se pudo crear la orden'}
                </div>`;
        }
    } catch (error) {
        console.error('Error al crear orden:', error);
        document.getElementById('orderCreated').innerHTML = 
            `<div style="background-color: #f8d7da; color: #721c24; padding: 10px; border: 1px solid #f5c6cb; border-radius: 4px; margin: 10px 0;">
                <strong>❌ Error de conexión:</strong> ${error.message}<br>
                <small>Verifica que el servidor esté ejecutándose</small>
            </div>`;
    }
};

// ----------- CONSULTAR ORDEN (CLIENTE) -----------
document.getElementById('trackForm').onsubmit = async function (e) {
    e.preventDefault();
    const orderId = document.getElementById('trackOrderId').value;
    const res = await fetch(`${API_URL}/orders/${orderId}`);
    const statusDiv = document.getElementById('orderStatus');
    if (res.ok) {
        const order = await res.json();
        let html = `<h3>Cliente: ${order.customer}</h3>`;
        html += `<ul>`;
        for (const service of order.services) {
            html += `<li><strong>${service.name}</strong> - <span class="status-${service.status.replace(' ', '\\ ')}">${service.status}</span></li>`;
        }
        html += `</ul>`;
        if (order.history.length) {
            html += `<h4>Historial:</h4><ul>`;
            for (const h of order.history) {
                html += `<li>${new Date(h.timestamp).toLocaleString()} - ${h.service} - ${h.status}${h.usuario ? ' (por ' + h.usuario + ')' : ''}</li>`;
            }
            html += `</ul>`;
        }
        statusDiv.innerHTML = html;
    } else {
        statusDiv.innerHTML = '<span style="color:red">Orden no encontrada</span>';
    }
};

// ----------- LOGIN TALLERISTA/ADMIN -----------
document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
        localStorage.setItem('taller_token', data.token);
        // Decodifica el JWT para saber el rol
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        if (payload.role === 'admin') {
            document.getElementById('registro-tallerista').style.display = '';
        } else {
            document.getElementById('registro-tallerista').style.display = 'none';
        }
        document.getElementById('loginStatus').textContent = "Acceso correcto.";
        document.getElementById('login-tallerista').style.display = 'none';
        document.getElementById('tallerista').style.display = '';
    } else {
        document.getElementById('loginStatus').textContent = data.error || "Error de login";
    }
};

document.getElementById('logoutBtn').onclick = function() {
    localStorage.removeItem('taller_token');
    document.getElementById('login-tallerista').style.display = '';
    document.getElementById('tallerista').style.display = 'none';
    document.getElementById('registro-tallerista').style.display = 'none';
};

// ----------- PANEL DE TALLERISTA -----------
document.getElementById('talleristaSearchForm').onsubmit = async function (e) {
    e.preventDefault();
    const orderId = document.getElementById('talleristaOrderId').value;
    const res = await fetch(`${API_URL}/orders/${orderId}`);
    const panelDiv = document.getElementById('talleristaPanel');
    if (res.ok) {
        const order = await res.json();
        let html = `<h3>Cliente: ${order.customer}</h3>`;
        html += `<ul>`;
        order.services.forEach((service, idx) => {
            html += `<li>
                <strong>${service.name}</strong> - 
                <span class="status-${service.status.replace(' ', '\\ ')}">${service.status}</span>
                <select data-idx="${idx}">
                    <option value="Pendiente" ${service.status === "Pendiente" ? "selected" : ""}>Pendiente</option>
                    <option value="En proceso" ${service.status === "En proceso" ? "selected" : ""}>En proceso</option>
                    <option value="Terminado" ${service.status === "Terminado" ? "selected" : ""}>Terminado</option>
                </select>
                <button class="actualizar" data-idx="${idx}">Actualizar</button>
            </li>`;
        });
        html += `</ul>`;
        if (order.history.length) {
            html += `<h4>Historial:</h4><ul>`;
            for (const h of order.history) {
                html += `<li>${new Date(h.timestamp).toLocaleString()} - ${h.service} - ${h.status}${h.usuario ? ' (por ' + h.usuario + ')' : ''}</li>`;
            }
            html += `</ul>`;
        }
        panelDiv.innerHTML = html;

        // Eventos de actualización (con token)
        panelDiv.querySelectorAll('button.actualizar').forEach(btn => {
            btn.onclick = async function() {
                const idx = parseInt(this.getAttribute('data-idx'), 10);
                const select = panelDiv.querySelector(`select[data-idx="${idx}"]`);
                const newStatus = select.value;
                const token = localStorage.getItem('taller_token');
                const updateRes = await fetch(`${API_URL}/orders/${orderId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ serviceIndex: idx, status: newStatus })
                });
                if (updateRes.ok) {
                    // Recargar la vista
                    document.getElementById('talleristaSearchForm').onsubmit(new Event('submit'));
                } else {
                    const err = await updateRes.json();
                    alert('Error al actualizar el estado: ' + (err.error || ''));
                    if (updateRes.status === 401 || updateRes.status === 403) {
                        localStorage.removeItem('taller_token');
                        document.getElementById('talleristaPanel').innerHTML = '';
                        document.getElementById('login-tallerista').style.display = '';
                        document.getElementById('tallerista').style.display = 'none';
                        document.getElementById('registro-tallerista').style.display = 'none';
                    }
                }
            }
        });

    } else {
        panelDiv.innerHTML = '<span style="color:red">Orden no encontrada</span>';
    }
};

// Mostrar el panel y el registro solo si es admin
window.onload = function() {
    const token = localStorage.getItem('taller_token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') {
            document.getElementById('registro-tallerista').style.display = '';
        } else {
            document.getElementById('registro-tallerista').style.display = 'none';
        }
        document.getElementById('login-tallerista').style.display = 'none';
        document.getElementById('tallerista').style.display = '';
    } else {
        document.getElementById('registro-tallerista').style.display = 'none';
    }
};