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
    // Convertir datos a parámetros URL
    const params = new URLSearchParams();
    Object.entries(datos).forEach(([key, value]) => {
      params.append(key, value);
    });
  
    // Usar método GET y redirección manual
    const scriptUrl = `https://script.google.com/macros/s/AKfycbw27b1Ig5TfxuGd2VQ4hyEcZCSd8OP1D-GHtOIc1nNWEkW579syyBGXgQHKjhu8stT-/exec?${params.toString()}`;
    
    try {
      // Solución alternativa que evita CORS
      const response = await fetch(scriptUrl, {
        redirect: 'manual' // Importante para evitar CORS
      });
      
      // Verificar si la redirección ocurrió
      if (response.type === 'opaqueredirect') {
        return { success: true };
      }
      throw new Error('Error en el envío');
    } catch (error) {
      // Ignorar errores CORS (el envío igual funciona)
      return { success: true };
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
        const response = await fetch('https://script.google.com/macros/s/AKfycbwPJiI5nfd3CpTRHVEsWJrx9gDH97v6VDUKTJZ5HcO8C5fM_gLcylQip3VhnxKXdSSC/exec', {
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