const rutasParciales = {
  "#site-header": "../views/partials/header.html",
  "#hero-view": "../views/partials/hero.html",
  "#gallery-view": "../views/partials/gallery.html",
  "#artist-view": "../views/partials/artist.html",
  "#contact-view": "../views/partials/contact.html",
  "#site-footer": "../views/partials/footer.html",
};

export class CuadroView {
  constructor() {
    this.formatoPrecio = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });
  }

  async cargarParciales() {
    await Promise.all(
      Object.entries(rutasParciales).map(async ([selector, ruta]) => {
        const contenedor = document.querySelector(selector);
        if (!contenedor) {
          throw new Error(`No se encontró el contenedor de vista ${selector}.`);
        }

        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
          throw new Error(
            `No se pudo cargar la vista ${ruta} (${respuesta.status}).`,
          );
        }

        contenedor.innerHTML = await respuesta.text();
      }),
    );
  }

  mostrarCategorias(categorias, cuadros) {
    const contenedor = document.querySelector("#gallery-filters");
    if (!contenedor) {
      throw new Error("No se encontró el contenedor de filtros de la galería.");
    }

    const botones = [
      { categoria: "todas", etiqueta: "Todas", cantidad: cuadros.length },
      ...categorias.map((categoria) => ({
        categoria,
        etiqueta: categoria,
        cantidad: cuadros.filter((cuadro) => cuadro.categoria === categoria).length,
      })),
    ];

    contenedor.replaceChildren(
      ...botones.map(({ categoria, etiqueta, cantidad }, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = `filter-chip${indice === 0 ? " is-active" : ""}`;
        boton.dataset.category = categoria;
        boton.setAttribute("aria-pressed", String(indice === 0));
        boton.append(document.createTextNode(etiqueta));

        if (indice === 0) {
          const contador = document.createElement("span");
          contador.textContent = String(cantidad).padStart(2, "0");
          boton.append(contador);
        }

        return boton;
      }),
    );
  }

  mostrarCuadros(cuadros) {
    const contenedor = document.querySelector("#art-grid");
    if (!contenedor) {
      throw new Error("No se encontró la cuadrícula de obras.");
    }

    contenedor.replaceChildren(...cuadros.map((cuadro) => this.crearTarjeta(cuadro)));
  }

  mostrarCarrusel(cuadros) {
    const carrusel = document.querySelector("#hero-carousel");
    const indicadores = carrusel?.querySelector(".hero-carousel-dots");

    if (!carrusel || !indicadores || cuadros.length === 0) {
      throw new Error("No se pudo inicializar el carrusel de obras destacadas.");
    }

    indicadores.replaceChildren(
      ...cuadros.map((cuadro, indice) => {
        const indicador = document.createElement("button");
        indicador.className = "hero-carousel-dot";
        indicador.type = "button";
        indicador.dataset.carouselIndex = String(indice);
        indicador.setAttribute("aria-label", `Mostrar ${cuadro.titulo}`);
        indicador.setAttribute("aria-pressed", String(indice === 0));
        return indicador;
      }),
    );

    this.actualizarCarrusel(cuadros, 0);
  }

  actualizarCarrusel(cuadros, indice) {
    const carrusel = document.querySelector("#hero-carousel");
    const imagen = carrusel?.querySelector(".hero-slide");
    const titulo = carrusel?.querySelector(".hero-caption-title");
    const contador = carrusel?.querySelector(".hero-caption-count");
    const obra = cuadros[indice];

    if (
      !carrusel ||
      !(imagen instanceof HTMLImageElement) ||
      !titulo ||
      !contador ||
      !obra
    ) {
      throw new Error("No se pudo actualizar la obra destacada.");
    }

    const urlImagen = new URL(obra.imagen);
    urlImagen.searchParams.set("auto", "format");
    urlImagen.searchParams.set("fit", "crop");
    urlImagen.searchParams.set("w", "1100");
    urlImagen.searchParams.set("q", "85");

    imagen.classList.add("is-changing");
    imagen.onload = () => imagen.classList.remove("is-changing");
    imagen.onerror = () => {
      imagen.classList.remove("is-changing");
      console.error(`No se pudo cargar la imagen de "${obra.titulo}".`);
    };
    imagen.src = urlImagen.href;
    imagen.alt = `${obra.titulo}. ${obra.descripcion}`;
    titulo.textContent = obra.titulo;
    contador.textContent = `${String(indice + 1).padStart(2, "0")} / ${String(cuadros.length).padStart(2, "0")}`;
    carrusel.setAttribute("aria-label", `Obras destacadas: ${obra.titulo}`);

    carrusel.querySelectorAll(".hero-carousel-dot").forEach((boton, posicion) => {
      boton.setAttribute("aria-pressed", String(posicion === indice));
    });
  }

  crearTarjeta(cuadro) {
    const articulo = document.createElement("article");
    articulo.className = "art-card";
    articulo.dataset.category = cuadro.categoria;

    const enlace = document.createElement("a");
    enlace.className = "art-image";
    enlace.href = "#contacto";
    enlace.setAttribute("aria-label", `Consultar por ${cuadro.titulo}`);

    const imagen = document.createElement("img");
    const urlImagen = new URL(cuadro.imagen);
    urlImagen.searchParams.set("auto", "format");
    urlImagen.searchParams.set("fit", "crop");
    urlImagen.searchParams.set("w", "900");
    urlImagen.searchParams.set("q", "85");
    imagen.src = urlImagen.href;
    imagen.alt = `${cuadro.titulo}. ${cuadro.descripcion}`;
    imagen.loading = "lazy";

    const accionImagen = document.createElement("span");
    accionImagen.className = "image-action";
    accionImagen.setAttribute("aria-hidden", "true");
    accionImagen.textContent = "↗";
    enlace.append(imagen, accionImagen);

    const detalles = document.createElement("div");
    detalles.className = "art-details";

    const texto = document.createElement("div");
    const categoria = document.createElement("p");
    categoria.className = "art-category";
    categoria.textContent = cuadro.categoria;

    const titulo = document.createElement("h3");
    titulo.textContent = cuadro.titulo;
    texto.append(categoria, titulo);

    const precio = document.createElement("p");
    precio.className = "art-price";
    precio.textContent = this.formatoPrecio.format(cuadro.precio);
    detalles.append(texto, precio);

    const disponibilidad = document.createElement("p");
    disponibilidad.className = `availability${cuadro.disponible ? "" : " is-sold"}`;
    disponibilidad.textContent = cuadro.disponible ? "Disponible" : "Obra vendida";

    articulo.append(enlace, detalles, disponibilidad);
    return articulo;
  }

  mostrarError(mensaje) {
    const aviso = document.createElement("p");
    aviso.className = "app-error";
    aviso.setAttribute("role", "alert");
    aviso.textContent = mensaje;
    document.body.prepend(aviso);
  }
}
