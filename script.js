document.addEventListener('DOMContentLoaded', function() {
    // Configura la fecha actual por defecto
    const fechaInput = document.getElementById('fecha');
    const today = new Date().toISOString().split('T')[0];
    fechaInput.value = today;
    
    // Manejar el envío del formulario
    const form = document.getElementById('gastoForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const familiar = document.getElementById('familiar').value;
        const monto = document.getElementById('monto').value;
        const descripcion = document.getElementById('descripcion').value;
        const fecha = document.getElementById('fecha').value;
        
        // Validación simple
        if (!familiar || !monto || !descripcion || !fecha) {
            mostrarMensaje('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Deshabilitar el botón para evitar múltiples envíos
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Preparar los datos para enviar
        const datos = {
            familiar: familiar,
            monto: parseFloat(monto).toFixed(2),
            descripcion: descripcion,
            fecha: fecha,
            timestamp: new Date().toISOString()
        };
        
        // Enviar datos a Google Sheets
        enviarDatos(datos);
    });
});

async function enviarDatos(datos) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwia_lky8W4j-HeN-BjxeUydx836GxwaOtZt2A_LXVap7zRsput0DlSmw3OyNOxPmxyqg/exec';
    
    try {
        // Intento con POST primero
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
            redirect: 'manual' // Importante para evitar CORS
        });

        // Si hay redirección (comportamiento normal de Apps Script)
        if (response.type === 'opaqueredirect') {
            // Segundo intento sin headers para evitar preflight
            const simpleResponse = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: new URLSearchParams(datos).toString(),
                redirect: 'manual'
            });
            
            if (simpleResponse.type === 'opaqueredirect') {
                mostrarMensaje('✅ Gasto registrado con éxito', 'exito');
                document.getElementById('gastoForm').reset();
                return;
            }
            throw new Error('Error en redirección');
        }

        const result = await response.json();
        if (result.success) {
            mostrarMensaje('✅ Gasto registrado con éxito', 'exito');
            document.getElementById('gastoForm').reset();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error en POST:', error);
        mostrarMensaje('❌ Error al registrar. Intenta recargar la página.', 'error');
    } finally {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar Gasto';
    }
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = 'mensaje ' + tipo;
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        mensajeDiv.textContent = '';
        mensajeDiv.className = 'mensaje';
    }, 5000);
}

// Función adicional para probar la conexión
async function probarConexion() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwia_lky8W4j-HeN-BjxeUydx836GxwaOtZt2A_LXVap7zRsput0DlSmw3OyNOxPmxyqg/exec', {
            method: 'OPTIONS'
        });
        console.log('Prueba de conexión OPTIONS:', response);
        return response.ok;
    } catch (error) {
        console.error('Error en prueba de conexión:', error);
        return false;
    }
}

// Ejecutar prueba de conexión al cargar la página (opcional)
window.addEventListener('load', async () => {
    const conexionOk = await probarConexion();
    console.log('Prueba de conexión:', conexionOk ? '✅ Exitosa' : '❌ Fallida');
});
