document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input-box");
    const pendientes = document.getElementById("pendientes");
    const realizado = document.getElementById("realizadas");

    // Asignación de eventos de forma segura
    document.getElementById("btn-agregar").addEventListener("click", agregar);
    document.getElementById("btn-mover").addEventListener("click", mover);
    document.getElementById("btn-remover").addEventListener("click", remover);

    async function cargar() {
        const res = await fetch('/api/estado');
        const data = await res.json();
        pendientes.innerHTML = data.pendientes;
        realizado.innerHTML = data.realizadas;
    }

    async function agregar() {
        const texto = input.value.trim();
        if (!texto) { alert("Debes escribir algo"); return; }
        
        const res = await fetch('/api/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: texto })
        });

        if (res.status === 400) {
            alert("El servidor rechazó la tarea: Ya existe o está vacía");
        } else {
            input.value = "";
            // Para que se vea en pantalla, añadimos el elemento visualmente aquí
            const li = document.createElement("li");
            li.className = "list-group-item d-flex align-items-center";
            li.innerHTML = `<i class="bi bi-square me-3" style="cursor:pointer"></i> <span>${texto}</span>`;
            pendientes.appendChild(li);
            salvar();
        }
    }

    async function mover() {
        const seleccionadas = pendientes.querySelectorAll(".marcada");
        seleccionadas.forEach(li => {
            li.classList.remove("marcada");
            li.classList.add("text-decoration-line-through", "text-muted");
            li.querySelector("i").className = "bi bi-square me-3";
            realizado.appendChild(li);
        });
        salvar();
    }

    async function remover() {
        realizado.querySelectorAll(".marcada").forEach(li => li.remove());
        salvar();
    }

    // Delegación de eventos para los iconos (porque los elementos se crean dinámicamente)
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

    async function salvar() {
        await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pendientes: pendientes.innerHTML, realizadas: realizado.innerHTML })
        });
    }

    cargar();
});