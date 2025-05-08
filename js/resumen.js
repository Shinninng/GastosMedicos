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
    console.log("[1] Iniciando carga de datos...");
    const startTime = Date.now();
    
    // 1. Intento de carga normal
    const response = await fetch(`${SCRIPT_URL}?action=getResumen`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log("[2] Respuesta recibida en", Date.now() - startTime, "ms");
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    // 2. Verificación de contenido
    const textData = await response.text();
    console.log("[3] Datos crudos:", textData.substring(0, 100) + (textData.length > 100 ? "..." : ""));
    
    const data = JSON.parse(textData);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    if (!Array.isArray(data)) {
      throw new Error("Formato de datos inválido");
    }
    
    console.log("[4] Datos parseados correctamente. Total:", data.length);
    
    // 3. Procesamiento
    displaySummary(data);
    
  } catch (error) {
    console.error("Error en loadData:", error);
    
    // Intento alternativo con enfoque diferente
    try {
      console.log("Intentando método alternativo...");
      const altResponse = await fetch(`${SCRIPT_URL}?action=getResumen&alt=1`);
      const altText = await altResponse.text();
      console.log("Respuesta alternativa:", altText.substring(0, 200));
      
      // Intento de parseo seguro
      let altData;
      try {
        altData = JSON.parse(altText);
      } catch (e) {
        altData = { error: "No se pudo parsear la respuesta" };
      }
      
      if (Array.isArray(altData)) {
        displaySummary(altData);
      } else {
        showError(`Error grave: ${altData.error || 'Formato desconocido'}`);
      }
    } catch (altError) {
      showError("Error crítico al cargar datos. Ver consola para detalles.");
      console.error("Error en método alternativo:", altError);
    }
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
