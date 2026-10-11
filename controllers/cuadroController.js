const correoArtista = "angeleslr4006@gmail.com";

export class CuadroController {
  constructor(modelo, vista) {
    this.modelo = modelo;
    this.vista = vista;
    this.categoriaActual = "todas";
  }

  async iniciar() {
    await this.vista.cargarParciales();

    const cuadros = this.modelo.obtenerTodos();
    this.vista.mostrarCategorias(this.modelo.obtenerCategorias(), cuadros);
    this.actualizarGaleria(cuadros);
    this.iniciarCarrusel(cuadros);
    this.registrarEventos();
  }

  iniciarCarrusel(cuadros) {
    this.cuadrosCarrusel = cuadros;
    this.indiceCarrusel = 0;
    this.carruselEnPausa = false;
    this.respetarMovimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    this.vista.mostrarCarrusel(cuadros);
    this.programarSiguienteObra();

    const carrusel = document.querySelector("#hero-carousel");
    if (!carrusel) {
      throw new Error("No se encontró el carrusel de obras destacadas.");
    }

    carrusel.addEventListener("click", (evento) => {
      if (!(evento.target instanceof Element)) {
        return;
      }

      const boton = evento.target.closest("button[data-carousel-action]");
      if (boton instanceof HTMLButtonElement) {
        this.moverCarrusel(
          boton.dataset.carouselAction === "previous" ? -1 : 1,
        );
        return;
      }

      const indicador = evento.target.closest("button[data-carousel-index]");
      if (indicador instanceof HTMLButtonElement) {
        const indice = Number(indicador.dataset.carouselIndex);
        if (Number.isInteger(indice)) {
          this.mostrarObra(indice);
        }
      }
    });

    carrusel.addEventListener("mouseenter", () => this.pausarCarrusel(true));
    carrusel.addEventListener("mouseleave", () => this.pausarCarrusel(false));
    carrusel.addEventListener("focusin", () => this.pausarCarrusel(true));
    carrusel.addEventListener("focusout", (evento) => {
      if (
        evento.relatedTarget instanceof Node &&
        carrusel.contains(evento.relatedTarget)
      ) {
        return;
      }
      this.pausarCarrusel(false);
    });

    document.addEventListener("visibilitychange", () => {
      this.pausarCarrusel(document.hidden);
    });

    this.respetarMovimientoReducido.addEventListener("change", () => {
      this.programarSiguienteObra();
    });
  }

  moverCarrusel(direccion) {
    const cantidad = this.cuadrosCarrusel.length;
    const indice = (this.indiceCarrusel + direccion + cantidad) % cantidad;
    this.mostrarObra(indice);
  }

  mostrarObra(indice) {
    if (indice < 0 || indice >= this.cuadrosCarrusel.length) {
      return;
    }

    this.indiceCarrusel = indice;
    this.vista.actualizarCarrusel(this.cuadrosCarrusel, indice);
    this.programarSiguienteObra();
  }

  pausarCarrusel(enPausa) {
    this.carruselEnPausa = enPausa;
    this.programarSiguienteObra();
  }

  programarSiguienteObra() {
    window.clearInterval(this.temporizadorCarrusel);
    this.temporizadorCarrusel = undefined;

    if (this.carruselEnPausa || this.respetarMovimientoReducido.matches) {
      return;
    }

    this.temporizadorCarrusel = window.setInterval(() => {
      this.moverCarrusel(1);
    }, 5000);
  }

  actualizarGaleria(cuadros = this.modelo.obtenerTodos()) {
    const filtrados =
      this.categoriaActual === "todas"
        ? cuadros
        : cuadros.filter((cuadro) => cuadro.categoria === this.categoriaActual);

    this.vista.mostrarCuadros(filtrados);
  }

  registrarEventos() {
    const filtros = document.querySelector("#gallery-filters");
    const formulario = document.querySelector("#contact-form");
    const estadoFormulario = document.querySelector("#form-status");

    if (
      !filtros ||
      !(formulario instanceof HTMLFormElement) ||
      !(estadoFormulario instanceof HTMLElement)
    ) {
      throw new Error("No se pudieron inicializar los eventos de la página.");
    }

    filtros.addEventListener("click", (evento) => {
      if (!(evento.target instanceof Element)) {
        return;
      }

      const boton = evento.target.closest("button[data-category]");
      if (!(boton instanceof HTMLButtonElement)) {
        return;
      }

      this.categoriaActual = boton.dataset.category ?? "todas";
      filtros.querySelectorAll("button[data-category]").forEach((filtro) => {
        const activo = filtro === boton;
        filtro.classList.toggle("is-active", activo);
        filtro.setAttribute("aria-pressed", String(activo));
      });
      this.actualizarGaleria();
    });

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      this.prepararCorreo(formulario, estadoFormulario);
    });
  }

  prepararCorreo(formulario, estado) {
    const datos = new FormData(formulario);
    const nombre = String(datos.get("nombre")).trim();
    const correo = String(datos.get("correo")).trim();
    const tema = String(datos.get("tema")).trim();
    const mensaje = String(datos.get("mensaje")).trim();
    const asunto = `${tema} — Lienzo Angie`;
    const cuerpo = [
      `Nombre: ${nombre}`,
      `Correo para responder: ${correo}`,
      "",
      mensaje,
    ].join("\n");

    estado.textContent =
      "Se está preparando un borrador dirigido a Angie. Revísalo y pulsa enviar en tu aplicación de correo.";
    window.location.href = `mailto:${correoArtista}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  }
}
