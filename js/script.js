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
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbynm3VLv57bGqfpcr_ftxCQyCfqIqRFkhkRCVtcdTvA2cIm4YsyD_GU2wHQCX0uuitT/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(datos).toString(),
        redirect: 'follow'
      });
  
      if (!response.ok) throw new Error('Error en la respuesta');
      return await response.json();
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
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
        const response = await fetch('https://script.google.com/macros/s/AKfycbynm3VLv57bGqfpcr_ftxCQyCfqIqRFkhkRCVtcdTvA2cIm4YsyD_GU2wHQCX0uuitT/exec', {
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