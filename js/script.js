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
  return new Promise((resolve) => {
    // 1. Crear contenedor seguro
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);

    // 2. Crear iframe y formulario
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-iframe-' + Date.now();
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbwUlLjcaygD6ecRxaQzKUx6i6oLPhPbeA2Z1gNK-hL-t0Eg5jin-x1pMtzrRVBOL6n9UA/exec';
    form.target = iframe.name;

    // 3. Agregar campos
    Object.entries({
      ...datos,
      monto: parseFloat(datos.monto).toFixed(2),
      fecha: datos.fecha || new Date().toISOString().split('T')[0]
    }).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // 4. Manejador de carga mejorado
    iframe.onload = function() {
      try {
        container.remove();
        resolve({ success: true });
      } catch (e) {
        console.log('Elementos ya removidos');
        resolve({ success: true });
      }
    };

    // 5. Adjuntar y enviar
    container.appendChild(iframe);
    container.appendChild(form);
    form.submit();

    // 6. Timeout de seguridad
    setTimeout(() => {
      try {
        container.remove();
        resolve({ success: true });
      } catch (e) {
        resolve({ success: true });
      }
    }, 3000);
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
