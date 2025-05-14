// common.js
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { db } from './firebase-config.js'; // Importa la instancia 'db'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

async function obtenerDatosFirebase() { // Renombrado para claridad
  try {
    const gastosRef = ref(db, 'gastos'); // Referencia al nodo 'gastos'
    const snapshot = await get(gastosRef); // Obtiene los datos una vez
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Firebase Realtime Database devuelve un objeto, hay que convertirlo a array si es necesario
      // para mantener la estructura que tus funciones de procesamiento esperan (un array de gastos)
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      return []; // Devuelve array vacío si no hay datos
    }
  } catch (error) {
    console.error("Error al obtener datos de Firebase:", error);
    throw error; // Relanza el error para que sea manejado por quien llama a la función
  }
}

function esMontoValido(monto) {
  const num = parseFloat(monto);
  return !isNaN(num) && num > 0;
}

function getCurrentMonthName() {
    return MESES[new Date().getMonth()];
}

export { MESES, obtenerDatosFirebase, esMontoValido, getCurrentMonthName };