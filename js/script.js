const botonModoOscuro = document.querySelector("#modoOscuroBtn");
const contadorCarrito = document.querySelector("#contadorCarrito");
const carritoVacio = document.querySelector("#carritoVacio");
const listaCarrito = document.querySelector("#listaCarrito");
const totalArticulos = document.querySelector("#totalArticulos");
const vaciarCarritoBtn = document.querySelector("#vaciarCarritoBtn");
const buscarFruta = document.querySelector("#buscarFruta");
const mensajeCatalogo = document.querySelector("#mensajeCatalogo");
const mensajeCarrito = document.querySelector("#mensajeCarrito");
const formularioContacto = document.querySelector("#formularioContacto");
const mensajeFormulario = document.querySelector("#mensajeFormulario");
const verMasBtn = document.querySelector("#verMasBtn");
const informacionExtra = document.querySelector("#informacionExtra");

const claveCarrito = "fruteriaDelDiaCarrito";
const claveModoOscuro = "fruteriaDelDiaModoOscuro";

let modoOscuro = false;

// Recuperar el carrito temporal guardado en la pestaña actual.
function obtenerCarrito() {

    try {
        const carritoGuardado = JSON.parse(sessionStorage.getItem(claveCarrito) || "[]");

        if (Array.isArray(carritoGuardado)) {
            return carritoGuardado;
        }

    } catch (error) {
        console.error("No se pudo recuperar el carrito.", error);
    }

    return [];
}

// Guardar temporalmente el carrito en la pestaña y devolver la lista actualizada.
function guardarCarrito(carrito) {

    try {
        sessionStorage.setItem(claveCarrito, JSON.stringify(carrito));
    } catch (error) {
        console.error("No se pudo guardar el carrito.", error);
    }

    return carrito;
}

// Calcular la cantidad total de frutas seleccionadas.
function contarArticulos(carrito) {

    return carrito.reduce(function(total, fruta) {
        return total + fruta.cantidad;
    }, 0);
}

// Añadir una fruta o cambiar su cantidad.
function modificarCarrito(nombreFruta, accion) {

    let carrito = obtenerCarrito();
    const frutaExistente = carrito.find(function(fruta) {
        return fruta.nombre === nombreFruta;
    });

    if (accion === "agregar") {

        if (frutaExistente) {
            frutaExistente.cantidad++;
        } else {
            carrito.push({
                nombre: nombreFruta,
                cantidad: 1
            });
        }

    } else if (accion === "sumar" && frutaExistente) {
        frutaExistente.cantidad++;

    } else if (accion === "restar" && frutaExistente) {
        frutaExistente.cantidad--;

    } else if (accion === "eliminar") {
        carrito = carrito.filter(function(fruta) {
            return fruta.nombre !== nombreFruta;
        });
    }

    carrito = carrito.filter(function(fruta) {
        return fruta.cantidad > 0;
    });

    guardarCarrito(carrito);

    return carrito;
}

// Actualizar el contador que aparece en la navegación.
function actualizarContadorCarrito() {

    const carrito = obtenerCarrito();
    const cantidad = contarArticulos(carrito);

    if (contadorCarrito) {
        contadorCarrito.textContent = cantidad;
    }

    return cantidad;
}

// Mostrar un aviso breve después de añadir una fruta.
function mostrarMensajeCarrito(mensaje) {

    if (!mensajeCarrito) {
        return;
    }

    mensajeCarrito.textContent = mensaje;
    mensajeCarrito.classList.remove("hidden");
}

// Aplicar el modo oscuro mediante una clase para conservar los colores de cada sección.
function aplicarModoOscuro(activar) {

    document.body.classList.toggle("modo-oscuro", activar);

    if (botonModoOscuro) {
        botonModoOscuro.textContent = activar ? "☀️" : "🌙";
    }
}

// Configurar el botón de modo oscuro y recordar la preferencia.
function configurarModoOscuro() {

    try {
        modoOscuro = localStorage.getItem(claveModoOscuro) === "true";
    } catch (error) {
        modoOscuro = false;
    }

    aplicarModoOscuro(modoOscuro);

    if (!botonModoOscuro) {
        return;
    }

    botonModoOscuro.addEventListener("click", function() {

        modoOscuro = !modoOscuro;

        try {
            localStorage.setItem(claveModoOscuro, String(modoOscuro));
        } catch (error) {
            console.error("No se pudo guardar el tema seleccionado.", error);
        }

        aplicarModoOscuro(modoOscuro);
    });
}

// Configurar el botón que muestra u oculta información de la frutería.
function configurarVerMas() {

    if (!verMasBtn || !informacionExtra) {
        return;
    }

    verMasBtn.addEventListener("click", function() {

        const estaOculto = informacionExtra.classList.contains("hidden");

        informacionExtra.classList.toggle("hidden", !estaOculto);
        verMasBtn.textContent = estaOculto ? "Ver menos" : "Ver más";
        verMasBtn.setAttribute("aria-expanded", String(estaOculto));
    });
}

// Filtrar las tarjetas por el nombre de la fruta.
function filtrarFrutas(termino, tarjetas) {

    const busqueda = termino.trim().toLocaleLowerCase("es");
    let cantidadVisible = 0;

    tarjetas.forEach(function(tarjeta) {

        const nombreFruta = tarjeta.dataset.fruta.toLocaleLowerCase("es");
        const coincide = nombreFruta.includes(busqueda);

        tarjeta.classList.toggle("hidden", !coincide);

        if (coincide) {
            cantidadVisible++;
        }
    });

    return cantidadVisible;
}

// Configurar la búsqueda de frutas mientras se escribe.
function configurarBusquedaFrutas() {

    if (!buscarFruta || !mensajeCatalogo) {
        return;
    }

    const tarjetasFruta = document.querySelectorAll(".tarjetaFruta");

    buscarFruta.addEventListener("input", function() {

        const cantidadVisible = filtrarFrutas(buscarFruta.value, tarjetasFruta);

        mensajeCatalogo.textContent = cantidadVisible === 1
            ? "Se encontró 1 fruta."
            : `Se encontraron ${cantidadVisible} frutas.`;
    });
}

// Crear los controles de cada fruta seleccionada en el carrito.
function crearFilaCarrito(fruta) {

    const fila = document.createElement("li");
    const nombre = document.createElement("span");
    const controles = document.createElement("div");
    const botonRestar = document.createElement("button");
    const cantidad = document.createElement("span");
    const botonSumar = document.createElement("button");
    const botonEliminar = document.createElement("button");

    fila.className = "flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between";
    nombre.className = "font-bold text-slate-800";
    nombre.textContent = fruta.nombre;

    controles.className = "flex flex-wrap items-center gap-2";

    botonRestar.type = "button";
    botonRestar.textContent = "−";
    botonRestar.setAttribute("aria-label", `Quitar una unidad de ${fruta.nombre}`);
    botonRestar.dataset.accion = "restar";
    botonRestar.dataset.nombre = fruta.nombre;
    botonRestar.className = "h-9 w-9 rounded-lg border border-slate-300 font-bold hover:bg-orange-100";

    cantidad.className = "min-w-8 text-center font-semibold";
    cantidad.textContent = fruta.cantidad;

    botonSumar.type = "button";
    botonSumar.textContent = "+";
    botonSumar.setAttribute("aria-label", `Añadir una unidad de ${fruta.nombre}`);
    botonSumar.dataset.accion = "sumar";
    botonSumar.dataset.nombre = fruta.nombre;
    botonSumar.className = "h-9 w-9 rounded-lg border border-slate-300 font-bold hover:bg-orange-100";

    botonEliminar.type = "button";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.dataset.accion = "eliminar";
    botonEliminar.dataset.nombre = fruta.nombre;
    botonEliminar.className = "rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50";

    controles.appendChild(botonRestar);
    controles.appendChild(cantidad);
    controles.appendChild(botonSumar);
    controles.appendChild(botonEliminar);

    fila.appendChild(nombre);
    fila.appendChild(controles);

    return fila;
}

// Dibujar el contenido guardado del carrito.
function renderizarCarrito() {

    if (!listaCarrito || !carritoVacio || !totalArticulos) {
        return;
    }

    const carrito = obtenerCarrito();
    const cantidad = contarArticulos(carrito);

    listaCarrito.replaceChildren();
    carritoVacio.classList.toggle("hidden", carrito.length > 0);
    totalArticulos.textContent = cantidad;

    carrito.forEach(function(fruta) {
        listaCarrito.appendChild(crearFilaCarrito(fruta));
    });

    actualizarContadorCarrito();
}

// Gestionar los botones para modificar las cantidades del carrito.
function configurarEventosCarrito() {

    if (listaCarrito) {
        listaCarrito.addEventListener("click", function(evento) {

            const boton = evento.target.closest("button[data-accion]");

            if (!boton) {
                return;
            }

            modificarCarrito(boton.dataset.nombre, boton.dataset.accion);
            renderizarCarrito();
        });
    }

    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", function() {
            guardarCarrito([]);
            renderizarCarrito();
        });
    }
}

// Configurar todos los botones para añadir frutas al carrito.
function configurarBotonesAgregar() {

    const botonesAgregar = document.querySelectorAll("button[data-agregar]");

    botonesAgregar.forEach(function(boton) {

        boton.addEventListener("click", function() {

            const nombreFruta = boton.dataset.agregar;
            const carrito = modificarCarrito(nombreFruta, "agregar");
            const cantidad = contarArticulos(carrito);

            actualizarContadorCarrito();
            mostrarMensajeCarrito(`${nombreFruta} se añadió al carrito. Total de frutas: ${cantidad}.`);
        });
    });
}

// Validar los cuatro campos del formulario de contacto.
function configurarFormularioContacto() {

    if (!formularioContacto || !mensajeFormulario) {
        return;
    }

    formularioContacto.addEventListener("submit", function(evento) {

        evento.preventDefault();

        const campos = [
            formularioContacto.elements.nombre,
            formularioContacto.elements.email,
            formularioContacto.elements.numero,
            formularioContacto.elements.mensaje
        ];
        const campoVacio = campos.some(function(campo) {
            return campo.value.trim() === "";
        });

        mensajeFormulario.classList.remove("hidden");

        if (campoVacio) {
            mensajeFormulario.textContent = "Completa los cuatro campos antes de continuar.";
            mensajeFormulario.className = "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800";
            return;
        }

        if (!formularioContacto.elements.email.checkValidity()) {
            mensajeFormulario.textContent = "Escribe una dirección de correo electrónico válida.";
            mensajeFormulario.className = "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800";
            return;
        }

        mensajeFormulario.textContent = "Formulario validado. Esta demostración todavía no envía los datos a un servidor.";
        mensajeFormulario.className = "rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800";
    });
}

// Inicializar las funciones que correspondan a la página abierta.
configurarModoOscuro();
configurarVerMas();
configurarBusquedaFrutas();
configurarBotonesAgregar();
configurarEventosCarrito();
configurarFormularioContacto();
actualizarContadorCarrito();
renderizarCarrito();
