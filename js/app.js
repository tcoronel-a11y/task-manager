
import { cargarTareasIniciales } from "./api.js";
import { guardarTareas } from "./storage.js";

// Elementos del formulario
const formulario = document.getElementById("formulario-tarea");
const campoTitulo = document.getElementById("titulo-tarea");
const campoDescripcion = document.getElementById("descripcion-tarea");
const campoPrioridad = document.getElementById("prioridad-tarea");

// Elementos de la aplicación
const listaTareas = document.getElementById("lista-tareas");
const notificacion = document.getElementById("notificacion");
const filtroEstado = document.getElementById("filtro-estado");
const busquedaTarea = document.getElementById("busqueda-tarea");
const ordenTareas = document.getElementById("orden-tareas");

// Dashboard
const totalTareas = document.getElementById("total-tareas");
const tareasPendientes = document.getElementById("tareas-pendientes");
const tareasCompletadas = document.getElementById("tareas-completadas");

// Estado de la aplicación
let tareas = [];

// Mostrar mensajes al usuario
function mostrarNotificacion(mensaje) {
    notificacion.textContent = mensaje;
}

// Guardar cambios en localStorage
function guardarCambios() {
    const guardado = guardarTareas(tareas);

    if (!guardado) {
        mostrarNotificacion("No se pudieron guardar los cambios en el navegador.");
    }

    return guardado;
}

// Escapar texto para evitar insertar HTML proporcionado por el usuario
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caracter];
    });
}

// Actualizar las métricas del dashboard
function actualizarDashboard() {
    const total = tareas.length;
    const completadas = tareas.filter(tarea => tarea.completed).length;
    const pendientes = total - completadas;

    totalTareas.textContent = total;
    tareasPendientes.textContent = pendientes;
    tareasCompletadas.textContent = completadas;
}

// Mostrar las tareas en pantalla
function renderizarTareas() {
    actualizarDashboard();

    let tareasFiltradas = [...tareas];

    // Filtrar por estado
    const estado = filtroEstado.value;

    if (estado === "pendientes") {
        tareasFiltradas = tareasFiltradas.filter(tarea => !tarea.completed);
    } else if (estado === "completadas") {
        tareasFiltradas = tareasFiltradas.filter(tarea => tarea.completed);
    }

    // Buscar por título
    const busqueda = busquedaTarea.value.trim().toLowerCase();

    tareasFiltradas = tareasFiltradas.filter(tarea =>
        tarea.title.toLowerCase().includes(busqueda)
    );

    // Ordenar las tareas
    if (ordenTareas.value === "prioridad") {
        const niveles = {
            Alta: 1,
            Media: 2,
            Baja: 3
        };

        tareasFiltradas.sort((a, b) =>
            niveles[a.priority] - niveles[b.priority]
        );
    } else {
        tareasFiltradas.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    // Limpiar la lista anterior
    listaTareas.innerHTML = "";

    if (tareasFiltradas.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No se encontraron tareas.";
        listaTareas.appendChild(mensaje);
        return;
    }

    // Crear las tarjetas de tareas
    tareasFiltradas.forEach(tarea => {
        const tarjeta = document.createElement("article");
        tarjeta.className = tarea.completed
            ? "tarjeta-tarea completada"
            : "tarjeta-tarea";

        tarjeta.innerHTML = `
            <h3>${escaparHTML(tarea.title)}</h3>
            <p>${escaparHTML(tarea.description)}</p>
            <span class="etiqueta-prioridad">
                Prioridad: ${escaparHTML(tarea.priority)}
            </span>
            <p>Estado: ${tarea.completed ? "Completada" : "Pendiente"}</p>
            <div class="acciones-tarea">
                <button type="button" data-accion="completar" data-id="${escaparHTML(tarea.id)}">
                    ${tarea.completed ? "Marcar pendiente" : "Completar"}
                </button>
                <button type="button" data-accion="editar" data-id="${escaparHTML(tarea.id)}">
                    Editar
                </button>
                <button type="button" data-accion="eliminar" data-id="${escaparHTML(tarea.id)}">
                    Eliminar
                </button>
            </div>
        `;

        listaTareas.appendChild(tarjeta);
    });
}

// Crear una tarea
formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    const titulo = campoTitulo.value.trim();
    const descripcion = campoDescripcion.value.trim();
    const prioridad = campoPrioridad.value;

    if (titulo === "" || descripcion === "") {
        mostrarNotificacion("Completa el título y la descripción de la tarea.");
        return;
    }

    const nuevaTarea = {
        id: `local-${Date.now()}`,
        title: titulo,
        description: descripcion,
        priority: prioridad,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tareas.push(nuevaTarea);

    if (guardarCambios()) {
        formulario.reset();
        mostrarNotificacion("¡Tarea creada correctamente!");
        renderizarTareas();
    } else {
        tareas.pop();
    }
});

// Gestionar los botones de las tareas
listaTareas.addEventListener("click", evento => {
    const boton = evento.target.closest("button[data-accion]");

    if (!boton) {
        return;
    }

    const id = boton.dataset.id;
    const accion = boton.dataset.accion;

    const indice = tareas.findIndex(tarea => String(tarea.id) === id);

    if (indice === -1) {
        return;
    }

    const tarea = tareas[indice];

    // Completar o volver a marcar como pendiente
    if (accion === "completar") {
        tarea.completed = !tarea.completed;

        if (guardarCambios()) {
            mostrarNotificacion("Estado de la tarea actualizado.");
            renderizarTareas();
        } else {
            tarea.completed = !tarea.completed;
        }
    }

    // Editar una tarea
    if (accion === "editar") {
        const nuevoTitulo = prompt("Nuevo título:", tarea.title);

        if (nuevoTitulo === null) {
            return;
        }

        const tituloValidado = nuevoTitulo.trim();

        if (tituloValidado === "") {
            mostrarNotificacion("El título no puede estar vacío.");
            return;
        }

        const nuevaDescripcion = prompt(
            "Nueva descripción:",
            tarea.description
        );

        if (nuevaDescripcion === null) {
            return;
        }

        const descripcionValidada = nuevaDescripcion.trim();

        if (descripcionValidada === "") {
            mostrarNotificacion("La descripción no puede estar vacía.");
            return;
        }

        const tituloAnterior = tarea.title;
        const descripcionAnterior = tarea.description;

        tarea.title = tituloValidado;
        tarea.description = descripcionValidada;

        if (guardarCambios()) {
            mostrarNotificacion("Tarea editada correctamente.");
            renderizarTareas();
        } else {
            tarea.title = tituloAnterior;
            tarea.description = descripcionAnterior;
        }
    }

    // Eliminar una tarea
    if (accion === "eliminar") {
        const confirmar = confirm(
            `¿Seguro que deseas eliminar "${tarea.title}"?`
        );

        if (!confirmar) {
            return;
        }

        const tareaEliminada = tareas.splice(indice, 1)[0];

        if (guardarCambios()) {
            mostrarNotificacion("Tarea eliminada correctamente.");
            renderizarTareas();
        } else {
            tareas.splice(indice, 0, tareaEliminada);
        }
    }
});

// Actualizar filtros y búsqueda en tiempo real
filtroEstado.addEventListener("change", renderizarTareas);
busquedaTarea.addEventListener("input", renderizarTareas);
ordenTareas.addEventListener("change", renderizarTareas);

// Inicializar la aplicación
async function inicializarAplicacion() {
    mostrarNotificacion("Cargando tareas...");

    const resultado = await cargarTareasIniciales();

    tareas = resultado.tareas;

    if (resultado.error) {
        mostrarNotificacion(resultado.error);
    } else {
        mostrarNotificacion("Tareas cargadas correctamente.");
    }

    renderizarTareas();
}

inicializarAplicacion();
