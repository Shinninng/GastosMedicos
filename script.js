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

 
    
    function enviarDatos(datos) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvpzL_sKK8J8MPhyoiIDJgjhM5n5k7dPBNID2Uvske3taeecbv3NlY_-mef5bgRhZyLg/exec';
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en el servidor');
        return response.text();
    })
    .then(text => {
        try {
            const data = JSON.parse(text);
            mostrarMensaje(data.message || '✅ Gasto registrado con éxito', 'exito');
            document.getElementById('gastoForm').reset();
        } catch {
            mostrarMensaje('✅ Gasto registrado con éxito', 'exito');
        }
    })
    .catch(error => {
        console.error('Error detallado:', error);
        mostrarMensaje('❌ Error al registrar: ' + error.message, 'error');
    })
    .finally(() => {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar Gasto';
    });
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
