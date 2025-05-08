document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    const fechaInput = document.getElementById('fecha');
    fechaInput.value = new Date().toISOString().split('T')[0];
    
    // Manejo del formulario
    const form = document.getElementById('gastoForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores
        const datos = {
            familiar: document.getElementById('familiar').value.trim(),
            monto: document.getElementById('monto').value,
            descripcion: document.getElementById('descripcion').value.trim(),
            fecha: document.getElementById('fecha').value
        };
        
        // Validación mejorada
        if (!datos.familiar || !datos.monto) {
            mostrarMensaje('Nombre y monto son obligatorios', 'error');
            return;
        }
        
        if (isNaN(parseFloat(datos.monto))) {
            mostrarMensaje('El monto debe ser un número válido', 'error');
            return;
        }
        
        // Deshabilitar botón
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            // Enviar datos
            const resultado = await enviarDatos(datos);
            
            if (resultado.success) {
                mostrarMensaje('Datos guardados exitosamente', 'success');
                form.reset(); // Limpiar formulario
            } else {
                mostrarMensaje(resultado.error || 'Error al enviar datos', 'error');
            }
        } catch (error) {
            mostrarMensaje('Error de conexión', 'error');
            console.error('Error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar';
        }
    });
});

// Método infalible para enviar datos
async function enviarDatos(datos) {
    return new Promise((resolve) => {
        // 1. Crear iframe oculto
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden-iframe';
        iframe.style.display = 'none';
        
        // 2. Crear formulario temporal
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = `https://script.google.com/macros/s/AKfycbyKtWqXmptCFdIG3Z6Vun5MImnW2TY9eOcIsZc9Sbo7vyJADmrVfyW1THh-y1zCXH5McA/exec?${
            new URLSearchParams({
                familiar: datos.familiar,
                monto: parseFloat(datos.monto).toFixed(2),
                descripcion: datos.descripcion || '',
                fecha: datos.fecha || new Date().toISOString().split('T')[0]
            })
        }`;
        form.target = 'hidden-iframe';
        
        // 3. Manejador de carga
        iframe.onload = () => {
            resolve({ success: true });
            document.body.removeChild(iframe);
            document.body.removeChild(form);
        };
        
        // 4. Adjuntar y enviar
        document.body.appendChild(iframe);
        document.body.appendChild(form);
        form.submit();
    });
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje ${tipo}`;
    
    setTimeout(() => {
        mensajeDiv.textContent = '';
        mensajeDiv.className = 'mensaje';
    }, 5000);
}
