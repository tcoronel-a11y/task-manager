
import { obtenerTareas, guardarTareas } from "./storage.js";

const URL_API = "https://jsonplaceholder.typicode.com/todos";

// Cargar tareas iniciales desde el almacenamiento o la API
export async function cargarTareasIniciales() {
    // Primero comprobamos si existen datos locales
    const tareasGuardadas = obtenerTareas();

    if (tareasGuardadas !== null) {
        return {
            tareas: tareasGuardadas,
            error: null
        };
    }

    // Si no existen datos locales, consultamos la API
    try {
        const respuesta = await fetch(URL_API);

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el servidor.");
        }

        const datosAPI = await respuesta.json();

        // Convertimos los datos de la API al formato de nuestra aplicación
        const tareasImportadas = datosAPI.slice(0, 10).map((tarea, indice) => ({
            id: `api-${tarea.id}`,
            title: tarea.title,
            description: "Tarea importada desde JSONPlaceholder",
            priority: "Media",
            completed: tarea.completed,
            createdAt: new Date(Date.now() - indice * 1000).toISOString()
        }));

        // Guardamos los datos importados para trabajar sin conexión
        const guardado = guardarTareas(tareasImportadas);

        if (!guardado) {
            throw new Error("No se pudieron guardar las tareas localmente.");
        }

        return {
            tareas: tareasImportadas,
            error: null
        };

    } catch (error) {
        console.error("Error al cargar la API:", error);

        return {
            tareas: [],
            error: "No fue posible conectar con la API. Puedes seguir utilizando TaskManager cuando tengas tareas guardadas."
        };
    }
}
