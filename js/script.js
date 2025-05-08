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

   if (!datos.familiar || !datos.monto) {
    console.error('Error: Campos requeridos faltantes');
    return { success: false };
  }

  const params = new URLSearchParams({
    familiar: datos.familiar,
    monto: parseFloat(datos.monto).toFixed(2),
    descripcion: datos.descripcion || '',
    fecha: datos.fecha || new Date().toISOString().split('T')[0],
    timestamp: Date.now() // Evita caché
  });

  const SCRIPT_ID = 'AKfycbzoAG5RvsWkgKyXxy1zcqbq9GVUEjHGVXOz0gRGMa-pZTgrvYfTSs10KVUDFqwmqhPNPQ';
  const url = `https://script.google.com/macros/s/${SCRIPT_ID}/exec?${params}`;

  try {
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'omit'
    });

      await new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = img.onerror = resolve;
    });

    console.log('Datos enviados a Google Sheets:', datos);
    return { success: true };
    
  } catch (error) {
    console.warn('Error visible en consola (pero los datos probablemente se enviaron):', error);
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

// enviarDatos({
//    familiar: 'Prueba',
//    monto: '100',
//    descripcion: 'Test desde consola'
//  }).then(console.log);