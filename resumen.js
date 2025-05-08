document.addEventListener('DOMContentLoaded', function() {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMM0BG0h-PacePHrM0QQO-5oy1px8ptV7qghS9oYEj4i9e_nSh6X-h7n_AFTarg8FI/exec';
    const btnAplicar = document.getElementById('aplicarFiltros');
    const btnReset = document.getElementById('resetFiltros');
    
    // Cargar datos iniciales
    cargarDatos();
    
    // Event listeners para los filtros
    btnAplicar.addEventListener('click', cargarDatos);
    btnReset.addEventListener('click', function() {
        document.getElementById('filtroMes').value = '';
        document.getElementById('filtroFamiliar').value = '';
        cargarDatos();
    });
    
    async function cargarDatos() {
        try {
            const mes = document.getElementById('filtroMes').value;
            const familiar = document.getElementById('filtroFamiliar').value;
            
            const response = await fetch(`${SCRIPT_URL}?action=getResumen`);
            const data = await response.json();
            
            // Filtrar datos si hay filtros aplicados
            let datosFiltrados = data;
            if (mes) datosFiltrados = datosFiltrados.filter(item => item.mes === mes);
            if (familiar) datosFiltrados = datosFiltrados.filter(item => item.familiar === familiar);
            
            mostrarDatos(datosFiltrados);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            alert('Error al cargar los datos. Por favor intenta nuevamente.');
        }
    }
    
    function mostrarDatos(datos) {
        const tbody = document.querySelector('#tablaResumen tbody');
        tbody.innerHTML = '';
        
        let totalGeneral = 0;
        const resumen = {};
        
        // Procesar datos para agrupar por familiar y mes
        datos.forEach(item => {
            const key = `${item.familiar}-${item.mes}`;
            if (!resumen[key]) {
                resumen[key] = {
                    familiar: item.familiar,
                    mes: item.mes,
                    total: 0,
                    detalles: []
                };
            }
            resumen[key].total += parseFloat(item.monto);
            resumen[key].detalles.push({
                descripcion: item.descripcion,
                monto: item.monto,
                fecha: item.fecha
            });
            totalGeneral += parseFloat(item.monto);
        });
        
        // Mostrar en la tabla
        Object.values(resumen).forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.familiar}</td>
                <td>${item.mes}</td>
                <td>$${item.total.toFixed(2)}</td>
                <td><button class="ver-detalles" data-familiar="${item.familiar}" data-mes="${item.mes}">Ver detalles</button></td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Mostrar total general
        document.getElementById('totalGeneral').textContent = `Total General: $${totalGeneral.toFixed(2)}`;
        
        // Agregar event listeners para los botones de detalles
        document.querySelectorAll('.ver-detalles').forEach(btn => {
            btn.addEventListener('click', function() {
                const familiar = this.getAttribute('data-familiar');
                const mes = this.getAttribute('data-mes');
                mostrarDetalles(resumen[`${familiar}-${mes}`].detalles);
            });
        });
    }
    
    function mostrarDetalles(detalles) {
        const mensaje = detalles.map(d => 
            `${d.fecha}: ${d.descripcion} - $${d.monto}`
        ).join('\n');
        
        alert(`Detalles de gastos:\n\n${mensaje}`);
    }
});