// registro.js
import { db } from './firebase-config.js'; // Importa la instancia 'db'
import { ref, push, set } from "firebase/database"; // Para escribir datos
import { getCurrentMonthName } from './common.js'; // Asumiendo que getCurrentMonthName está en common.js

document.addEventListener('DOMContentLoaded', () => { // Espera a que el DOM esté cargado
    const form = document.getElementById('registroForm');
    const integranteSelect = document.getElementById('integrante');
    const montoInput = document.getElementById('monto');
    const descripcionInput = document.getElementById('descripcion');

    const errorIntegrante = document.getElementById('errorIntegrante');
    const errorMonto = document.getElementById('errorMonto');
    const errorDescripcion = document.getElementById('errorDescripcion');
    const formMessage = document.getElementById('formMessage');

    function validate() {
        let valid = true;
        // ... (tu lógica de validación actual, no necesita cambios)
        if (!integranteSelect.value) {
          errorIntegrante.classList.remove('hidden');
          valid = false;
        } else {
          errorIntegrante.classList.add('hidden');
        }

        const montoVal = parseFloat(montoInput.value);
        if (isNaN(montoVal) || montoVal <= 0) {
          errorMonto.classList.remove('hidden');
          valid = false;
        } else {
          errorMonto.classList.add('hidden');
        }

        if (!descripcionInput.value.trim()) {
          errorDescripcion.classList.remove('hidden');
          valid = false;
        } else {
          errorDescripcion.classList.add('hidden');
        }
        return valid;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';
        formMessage.classList.remove('text-green-600', 'text-red-600');

        if (!validate()) {
            return;
        }

        const data = {
            mes: getCurrentMonthName(), // Usando la función de common.js
            integrante: integranteSelect.value,
            // Firebase almacena números como números, no necesitas toFixed(2) aquí
            // al menos que quieras que se guarde específicamente como string con dos decimales.
            // Generalmente es mejor guardar como número y formatear al mostrar.
            monto: parseFloat(montoInput.value),
            descripcion: descripcionInput.value.trim(),
            // Considera añadir un timestamp para ordenamiento o auditoría
            // timestamp: serverTimestamp() // Necesitarías importar serverTimestamp de "firebase/database"
        };

        try {
            const gastosRef = ref(db, 'gastos'); // Referencia a la colección 'gastos'
            const newGastoRef = push(gastosRef); // Crea un nuevo ID único
            await set(newGastoRef, data); // Guarda los datos en esa nueva referencia

            formMessage.textContent = 'Gasto registrado correctamente.';
            formMessage.classList.add('text-green-600');
            form.reset();
            integranteSelect.selectedIndex = 0; // O integranteSelect.value = "";
        } catch (error) {
            console.error("Error al guardar el gasto:", error);
            formMessage.textContent = error.message || 'Error al guardar el gasto.';
            formMessage.classList.add('text-red-600');
        }
    });
});


    (() => {
      const form = document.getElementById('registroForm');
      const integranteSelect = document.getElementById('integrante');
      const montoInput = document.getElementById('monto');
      const descripcionInput = document.getElementById('descripcion');

      const errorIntegrante = document.getElementById('errorIntegrante');
      const errorMonto = document.getElementById('errorMonto');
      const errorDescripcion = document.getElementById('errorDescripcion');
      const formMessage = document.getElementById('formMessage');

      // Helper to get current month name in Spanish
      function getCurrentMonthName() {
        const meses = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        const now = new Date();
        return meses[now.getMonth()];
      }

      function validate() {
        let valid = true;

        if (!integranteSelect.value) {
          errorIntegrante.classList.remove('hidden');
          valid = false;
        } else {
          errorIntegrante.classList.add('hidden');
        }

        const montoVal = parseFloat(montoInput.value);
        if (isNaN(montoVal) || montoVal <= 0) {
          errorMonto.classList.remove('hidden');
          valid = false;
        } else {
          errorMonto.classList.add('hidden');
        }

        if (!descripcionInput.value.trim()) {
          errorDescripcion.classList.remove('hidden');
          valid = false;
        } else {
          errorDescripcion.classList.add('hidden');
        }

        return valid;
      }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';
        formMessage.classList.remove('text-green-600', 'text-red-600');

        if (!validate()) {
          return;
        }

        const data = {
          mes: getCurrentMonthName(),
          integrante: integranteSelect.value,
          monto: parseFloat(montoInput.value).toFixed(2),
          descripcion: descripcionInput.value.trim(),
        };

        const db = firebase.database(); // Inicializamos la base de datos de Firebase

      try {
        // Guardar datos en Firebase Realtime Database
        await db.ref('gastos').push(data);  // 'gastos' es el nombre que le damos a nuestra colección de datos
        formMessage.textContent = 'Gasto registrado correctamente.';
        formMessage.classList.add('text-green-600');
        form.reset();
        integranteSelect.selectedIndex = 0;
      } catch (error) {
        formMessage.textContent = error.message || 'Error al guardar el gasto.';
        formMessage.classList.add('text-red-600');
      }
            });
          })();
