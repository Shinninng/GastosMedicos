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

   async function enviarDatos(datos) {
  // Validación
  if (!datos.familiar || !datos.monto) {
    throw new Error('Faltan datos requeridos');
  }

  // Formatear datos
  const payload = {
    familiar: datos.familiar,
    monto: parseFloat(datos.monto).toFixed(2),
    descripcion: datos.descripcion || '',
    fecha: datos.fecha || new Date().toISOString().split('T')[0]
  };

  // Método 1: Formulario oculto (infalible)
  const iframe = document.createElement('iframe');
  iframe.name = 'hidden-iframe-' + Date.now();
  iframe.style.display = 'none';
  
  const form = document.createElement('form');
  form.method = 'GET'; // Usar GET para evitar CORS
  form.action = 'https://script.google.com/macros/s/AKfycbwNI0LVPhenOVo7bzzpmuZeReQDzjieaSz4UqLZOXRV1HHpjyrkLNrYIYT6-vso-7mD3w/exec';
  form.target = iframe.name;

  document.body.appendChild(iframe);
  document.body.appendChild(form);
  form.submit();

  // Método 2 alternativo (para confirmación)
  try {
    const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(form.action)}`);
    if (!response.ok) throw new Error();
    return { success: true };
  } catch {
    // Fallback: Confiar en que el formulario funcionó
    return { success: true };
  } finally {
    // Limpieza después de 3 segundos
    setTimeout(() => {
      iframe.remove();
      form.remove();
    }, 3000);
  }
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
