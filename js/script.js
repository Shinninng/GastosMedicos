if (typeof HTMLFormElement.prototype.submit !== 'function') {
  HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function() {
    if (!document.body.contains(this)) {
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      tempDiv.appendChild(this);
      document.body.appendChild(tempDiv);
    }
    this._submit();
  };
}
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
    // 1. Crear contenedor permanente (solo una vez)
    let formContainer = document.getElementById('form-container');
    if (!formContainer) {
      formContainer = document.createElement('div');
      formContainer.id = 'form-container';
      formContainer.style.display = 'none';
      document.body.appendChild(formContainer);
    }

    // 2. Crear iframe con ID único
    const iframe = document.createElement('iframe');
    iframe.name = `hidden-iframe-${Date.now()}`;
    iframe.style.display = 'none';

    // 3. Crear formulario
    const form = document.createElement('form');
    form.method = 'GET';
    form.action = `https://script.google.com/macros/s/AKfycbwNI0LVPhenOVo7bzzpmuZeReQDzjieaSz4UqLZOXRV1HHpjyrkLNrYIYT6-vso-7mD3w/exec?${new URLSearchParams({
      familiar: datos.familiar,
      monto: parseFloat(datos.monto).toFixed(2),
      descripcion: datos.descripcion || '',
      fecha: datos.fecha || new Date().toISOString().split('T')[0]
    })}`;
    form.target = iframe.name;

    // 4. Adjuntar elementos AL CONTENEDOR PRIMERO
    formContainer.appendChild(iframe);
    formContainer.appendChild(form);

    // 5. Manejador de carga seguro
    iframe.onload = () => {
      resolve({ success: true });
      // No remover los elementos, se reutilizan
    };

    // 6. Enviar formulario
    form.submit();

    // Timeout de respaldo
    setTimeout(() => resolve({ success: true }), 2000);
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
