console.log("Script cargado correctamente");
import { 
    MESES, 
    groupData, 
    sortData, 
    generateSummaryHTML, 
    showDetails, 
    showError, 
    initMonthFilter 
} from './common.js';

// Configuración
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydcXI7kB_2R7pYYO5N4TzL0ZmnDzvcdN6y3VzooTjrpVBS5mhlqzgrOEUkZoP4tYzR/exec';

// Elementos del DOM
const elements = {
    monthFilter: document.getElementById('month-filter'),
    applyBtn: document.getElementById('apply-filter'),
    summaryContainer: document.getElementById('summary-container'),
    filterMJCarolina: document.getElementById('filter-mj-carolina'),
    resetBtn: document.getElementById('reset-filters')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initMonthFilter(elements.monthFilter);
    loadData();
    
    elements.applyBtn.addEventListener('click', loadData);
    elements.filterMJCarolina.addEventListener('click', filterBySpecialPersons);
    elements.resetBtn.addEventListener('click', resetFilters);
});

// Funciones específicas de resumen
async function loadData() {
  try {
    console.log('Iniciando carga de datos...');
    const response = await fetch(`${SCRIPT_URL}?action=getResumen&cachebuster=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Verificación profunda de datos
    if (result.error) {
      throw new Error(result.error);
    }
    
    if (!Array.isArray(result)) {
      throw new Error('Formato de respuesta inválido');
    }
    
    console.log('Datos recibidos:', result);
    
    // Procesamiento seguro
    const datosFiltrados = result.filter(item => 
      item.fecha && item.familiar && !isNaN(item.monto)
    );
    
    if (datosFiltrados.length === 0 && result.length > 0) {
      console.warn('Todos los datos fueron filtrados:', result);
    }
    
    displaySummary(datosFiltrados);
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
    showError(`Error: ${error.message}. Ver consola para detalles.`);
    
    // Datos de prueba para diagnóstico
    const datosPrueba = [{
      fecha: new Date().toISOString().split('T')[0],
      familiar: 'Maria Jose',
      monto: 1000,
      descripcion: 'Prueba fallback',
      mes: 'Mayo'
    }];
    displaySummary(datosPrueba);
  }
}

function filterData(data) {
    let filtered = data;
    const selectedMonth = elements.monthFilter.value;
    
    if (selectedMonth) {
        filtered = filtered.filter(item => item.mes === selectedMonth);
    }
    
    return filtered;
}

function displaySummary(data) {
    const grouped = groupData(data);
    const sorted = sortData(grouped);
    
    elements.summaryContainer.innerHTML = generateSummaryHTML(sorted);
    addDetailsEventListeners();
}

function filterBySpecialPersons() {
    fetch(`${SCRIPT_URL}?action=getResumen`)
        .then(response => response.json())
        .then(data => {
            const filtered = data.filter(item => 
                PERSONAS_ESPECIALES.includes(item.familiar)
            );
            displaySummary(filtered);
            elements.monthFilter.value = ''; 
        })
        .catch(error => showError(elements.summaryContainer, error.message));
}

function resetFilters() {
    elements.monthFilter.value = '';
    loadData();
}

function addDetailsEventListeners() {
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            showDetails(window.groupedData[key].detalles);
        });
    });
}

// Hacer accesible los datos agrupados para los detalles
window.groupedData = {};
