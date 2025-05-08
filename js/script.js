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
    const SCRIPT_URL = 'hhttps://script.google.com/macros/s/AKfycbyEpKHnuP4oFrHTOUwkwfCMX5KUmfv70-QeVu-Rj3rDIsEv_5HgLvLtytjn8NqHFsiq/exec';
    
    try {
        // Convertir datos a FormData
        const formData = new URLSearchParams();
        formData.append('familiar', datos.familiar);
        formData.append('monto', datos.monto);
        formData.append('descripcion', datos.descripcion);
        formData.append('fecha', datos.fecha);
        formData.append('timestamp', datos.timestamp);

        // Enviar como POST
        const response = await fetch(`${SCRIPT_URL}?${formData.toString()}`, {
            method: 'POST',
            redirect: 'follow'
        });

        // Verificar si la redirección fue exitosa
        if (response.redirected) {
            mostrarMensaje('✅ Gasto registrado con éxito', 'exito');
            document.getElementById('gastoForm').reset();
            document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
            return;
        }

        throw new Error('Error en el servidor');
    } catch (error) {
        console.error('Error completo:', error);
        mostrarMensaje('❌ Error al registrar. Intenta nuevamente.', 'error');
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
        const response = await fetch('https://script.google.com/macros/s/AKfycbyEpKHnuP4oFrHTOUwkwfCMX5KUmfv70-QeVu-Rj3rDIsEv_5HgLvLtytjn8NqHFsiq/exec', {
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