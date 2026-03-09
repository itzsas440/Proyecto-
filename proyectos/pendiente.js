// Referencias a elementos del DOM
const elementos = document.getElementById("input-box");
const pendientes = document.getElementById("pendientes");
const realizado = document.getElementById("realizadas");
// Cargar tareas guardadas al iniciar
cargar();

//Crea una nueva tarea en la lista de pendientes
function agregar() {
    const texto = elementos.value.trim();
    if (!texto) {
        alert("Debes escribir algo");
        return;
    }
    const existente = pendientes.querySelectorAll("span");

    for (let pendiente of existente) {
        if (pendiente.textContent.toLowerCase() === texto.toLowerCase()) {
            alert("Esa tarea ya existe");
            return;
        }
    }
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center";
    li.innerHTML = `<i class="bi bi-square me-3" style="cursor:pointer"></i> <span>${texto}</span>`;
    pendientes.appendChild(li);
    elementos.value = "";
    salvar();
}

//Permite marcar o desmarcar tareas
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("bi-square") || e.target.classList.contains("bi-check-square-fill")) {
        const li = e.target.closest("li");
        const icono = li.querySelector("i");
        if (icono.classList.contains("bi-square")) {
            icono.className = "bi bi-check-square-fill me-3 text-primary";
            li.classList.add("marcada");
        } else {
            icono.className = "bi bi-square me-3";
            li.classList.remove("marcada");
        }
        salvar();
    }
});

//Pasa tareas seleccionadas a realizadas
function mover() {
    const seleccionadas = pendientes.querySelectorAll(".marcada");
    seleccionadas.forEach(li => {
        li.classList.remove("marcada");
        li.classList.add("text-decoration-line-through", "text-muted");
        li.querySelector("i").className = "bi bi-square me-3";
        realizado.appendChild(li);
    });

    salvar();
}

//Elimina tareas seleccionadas de realizadas
function remover() {
    const seleccionadas = realizado.querySelectorAll(".marcada");
    seleccionadas.forEach(li => {
        li.remove();
    });
    salvar();
}

//Almacena las listas en localStorage 
function salvar() {
    localStorage.setItem("pendientes", pendientes.innerHTML);
    localStorage.setItem("realizado", realizado.innerHTML);
}

//Recupera las tareas guardadas
function cargar() {
    pendientes.innerHTML = localStorage.getItem("pendientes") || "";
    realizado.innerHTML = localStorage.getItem("realizado") || "";
}