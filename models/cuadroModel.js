export const cuadrosIniciales = [
  {
    id: "obra-001",
    titulo: "Atardecer en calma",
    descripcion: "Paisaje de tonos cálidos inspirado en la luz del final del día.",
    precio: 180,
    imagen: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    categoria: "Óleo",
    disponible: true,
  },
  {
    id: "obra-002",
    titulo: "Jardín de primavera",
    descripcion: "Flores silvestres pintadas en acuarela sobre papel.",
    precio: 95,
    imagen: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342",
    categoria: "Acuarela",
    disponible: true,
  },
  {
    id: "obra-003",
    titulo: "Ritmo azul",
    descripcion: "Composición abstracta de formas y matices azules.",
    precio: 220,
    imagen: "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
    categoria: "Abstracto",
    disponible: true,
  },
  {
    id: "obra-004",
    titulo: "La casa del olivo",
    descripcion: "Una casa de campo rodeada de olivos y luz mediterránea.",
    precio: 260,
    imagen: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
    categoria: "Óleo",
    disponible: false,
  },
  {
    id: "obra-005",
    titulo: "Flores para Clara",
    descripcion: "Estudio floral delicado con transparencias y colores suaves.",
    precio: 110,
    imagen: "https://images.unsplash.com/photo-1577083288073-40892c0860a4",
    categoria: "Acuarela",
    disponible: true,
  },
  {
    id: "obra-006",
    titulo: "Geometría del corazón",
    descripcion: "Piezas de color que se encuentran en una composición vibrante.",
    precio: 195,
    imagen: "https://images.unsplash.com/photo-1549490349-8643362247b5",
    categoria: "Abstracto",
    disponible: true,
  },
];

export class CuadroModel {
  constructor(cuadros = cuadrosIniciales) {
    this.cuadros = cuadros.map((cuadro) => ({ ...cuadro }));
  }

  obtenerTodos() {
    return this.cuadros.map((cuadro) => ({ ...cuadro }));
  }

  obtenerPorId(id) {
    const cuadro = this.cuadros.find((item) => item.id === id);
    return cuadro ? { ...cuadro } : null;
  }

  obtenerPorCategoria(categoria) {
    const categoriaNormalizada = categoria.trim().toLocaleLowerCase();

    return this.cuadros
      .filter(
        (cuadro) =>
          cuadro.categoria.trim().toLocaleLowerCase() === categoriaNormalizada,
      )
      .map((cuadro) => ({ ...cuadro }));
  }

  obtenerCategorias() {
    return [...new Set(this.cuadros.map((cuadro) => cuadro.categoria))];
  }

  obtenerDisponibles() {
    return this.cuadros
      .filter((cuadro) => cuadro.disponible)
      .map((cuadro) => ({ ...cuadro }));
  }
}
