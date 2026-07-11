import { City } from '../models/city';
import { Movie } from '../models/movie';
import { Cinema } from '../models/cinema';
import { Schedule } from '../models/schedule';
import { SnackCategory } from '../models/snack-category';
import { SnackProduct } from '../models/snack-product';

export class MockDataService {
  private static cities: City[] = [
    { id: '1', name: 'Ambato' },
    { id: '2', name: 'Babahoyo' },
    { id: '3', name: 'Bahia de Caraquez' },
    { id: '4', name: 'Daule' },
    { id: '5', name: 'Duran' },
    { id: '6', name: 'Guayaquil' },
    { id: '7', name: 'La Libertad' },
    { id: '8', name: 'Machala' },
    { id: '9', name: 'Manta' },
    { id: '10', name: 'Milagro' },
    { id: '11', name: 'Playas' },
    { id: '12', name: 'Portoviejo' },
    { id: '13', name: 'Quevedo' },
    { id: '14', name: 'Quito' }
  ];

  private static cinemas: Cinema[] = [];
  private static movies: Movie[] = [];
  private static snackCategories: SnackCategory[] = [
    { id: 'cat1', name: 'Promociones', iconName: 'res://promociones' },
    { id: 'cat2', name: 'Combos', iconName: 'res://combos' },
    { id: 'cat3', name: 'Bebidas Frías', iconName: 'res://bebidas_frias' },
    { id: 'cat4', name: 'Bebidas Calientes', iconName: 'res://bebidas_calientes' },
    { id: 'cat5', name: 'Snacks', iconName: 'res://snacks' },
    { id: 'cat6', name: 'Dulces', iconName: 'res://dulces' },
    { id: 'cat7', name: 'Extras', iconName: 'res://extras' },
    { id: 'cat8', name: 'Pochoclos', iconName: 'res://pochoclos' },
    { id: 'cat9', name: 'Combos Especiales', iconName: 'res://combos_especiales' },
    { id: 'cat10', name: 'Novedades', iconName: 'res://novedades' }
  ];
  private static snackProducts: SnackProduct[] = [];

  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized) return;

    // Generate Cinemas
    this.cities.forEach(city => {
      this.cinemas.push({
        id: `cin_${city.id}_1`,
        name: `Supercines ${city.name} Centro`,
        cityName: city.name,
        address: `Av. Principal y Calle Secundaria, Centro Comercial ${city.name}`,
        imageUrl: 'https://picsum.photos/id/1018/400/250'
      });
      this.cinemas.push({
        id: `cin_${city.id}_2`,
        name: `Supercines ${city.name} VIP Plaza`,
        cityName: city.name,
        address: `Av. Metropolitana N34 y Plaza Sur, ${city.name}`,
        imageUrl: 'https://picsum.photos/id/1025/400/250'
      });
    });

    // Movie Templates for generating 40 movies
    const titles = [
      { t: 'Spider-Man: Un Nuevo Día Dob 2D', e: 'Spider-Man: Brand New Day', g: 'Acción', r: '12 años', l: 'PREVENTA' },
      { t: 'Spider-Man: Un Nuevo Día Dob 3D', e: 'Spider-Man: Brand New Day', g: 'Acción', r: '12 años', l: 'PREVENTA' },
      { t: 'La Odisea Dob 2D', e: 'The Odyssey', g: 'Ciencia Ficción', r: '12+ años', l: 'PREVENTA' },
      { t: 'La Odisea IMAX Dob 2D', e: 'The Odyssey', g: 'Ciencia Ficción', r: '12+ años', l: 'PREVENTA' },
      { t: 'Evil Dead En Llamas Dob 2D', e: 'Evil Dead Burn', g: 'Terror', r: '15+ años', l: 'ESTRENO' },
      { t: 'Moana Live Action Dob 2D', e: 'Moana Live Action', g: 'Aventura', r: 'Todo Público', l: 'ESTRENO' },
      { t: 'Moana Live Action Dob 3D', e: 'Moana Live Action', g: 'Aventura', r: 'Todo Público', l: 'ESTRENO' },
      { t: 'Moana Live Action IMAX Dob 2D', e: 'Moana Live Action', g: 'Aventura', r: 'Todo Público', l: 'ESTRENO' },
      { t: 'Minions & Monstruos Dob 2D', e: 'Minions & Monsters', g: 'Animación', r: 'Todo Público', l: '' },
      { t: 'Supergirl: El Origen Dob 2D', e: 'Supergirl: Origin', g: 'Ciencia Ficción', r: '12+ años', l: '' },
      { t: 'Toy Story 5 Dob 2D', e: 'Toy Story 5', g: 'Animación', r: 'Todo Público', l: '' },
      { t: 'Gladiador II Dob 2D', e: 'Gladiator II', g: 'Acción', r: '15+ años', l: '' },
      { t: 'Duna: Parte Tres Dob 2D', e: 'Dune: Part Three', g: 'Ciencia Ficción', r: '12+ años', l: '' },
      { t: 'Batman: Cruzado de Capa Dob 2D', e: 'Batman: Caped Crusader', g: 'Acción', r: '12+ años', l: '' },
      { t: 'Interestelar Reestreno Dob 2D', e: 'Interstellar', g: 'Ciencia Ficción', r: 'Todo Público', l: '' },
      { t: 'Wicked Parte 1 Dob 2D', e: 'Wicked Part 1', g: 'Musical', r: 'Todo Público', l: '' },
      { t: 'Sonic 3 La Película Dob 2D', e: 'Sonic the Hedgehog 3', g: 'Aventura', r: 'Todo Público', l: '' },
      { t: 'Nosferatu Dob 2D', e: 'Nosferatu', g: 'Terror', r: '15+ años', l: '' }
    ];

    // Source images for movies
    const imageIds = [
      'https://picsum.photos/id/237/300/450',
      'https://picsum.photos/id/10/300/450',
      'https://picsum.photos/id/100/300/450',
      'https://picsum.photos/id/1002/300/450',
      'https://picsum.photos/id/101/300/450',
      'https://picsum.photos/id/1015/300/450',
      'https://picsum.photos/id/1016/300/450',
      'https://picsum.photos/id/102/300/450',
      'https://picsum.photos/id/1024/300/450',
      'https://picsum.photos/id/1029/300/450',
      'https://picsum.photos/id/103/300/450',
      'https://picsum.photos/id/1035/300/450',
      'https://picsum.photos/id/1043/300/450',
      'https://picsum.photos/id/1050/300/450',
      'https://picsum.photos/id/1062/300/450',
      'https://picsum.photos/id/1069/300/450',
      'https://picsum.photos/id/1074/300/450',
      'https://picsum.photos/id/1084/300/450'
    ];

    for (let i = 0; i < 40; i++) {
      const template = titles[i % titles.length];
      const posterUrl = imageIds[i % imageIds.length];
      const movieId = `movie_${i + 1}`;
      
      // Generate 20 schedules per movie
      const movieSchedules: Schedule[] = [];
      const hours = ['10H00', '11H00', '11H30', '13H15', '14H15', '14H45', '16H30', '17H30', '18H00', '19H45', '20H30', '21H00', '21H45', '22H00'];
      const rooms = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 5', 'Sala 5 - VIP', 'Sala 6', 'Sala 7', 'Sala 7 - VIP', 'Sala 8', 'Sala 8 - VIP', 'Sala 9', 'Sala 10'];
      const formats = ['2D', '3D', 'IMAX'];

      for (let j = 0; j < 20; j++) {
        const time = hours[(j + i) % hours.length];
        const room = rooms[(j * 2 + i) % rooms.length];
        const format = formats[(j + i) % formats.length];
        movieSchedules.push({
          id: `sched_${movieId}_${j}`,
          time,
          room: `${room} (${format})`,
          format
        });
      }

      // Sort schedules by time
      movieSchedules.sort((a, b) => a.time.localeCompare(b.time));

      this.movies.push({
        id: movieId,
        title: i >= titles.length ? `${template.t} ${Math.floor(i / titles.length) + 1}` : template.t,
        englishTitle: template.e,
        language: i % 4 === 0 ? 'Subtitulada' : 'Doblada',
        duration: `${100 + (i * 3) % 60} min`,
        rating: template.r,
        posterUrl,
        label: i % 7 === 0 ? 'PREVENTA' : i % 5 === 0 ? 'ESTRENO' : i % 9 === 0 ? 'PROXIMAMENTE' : '',
        genre: template.g,
        synopsis: `Esta es la sinopsis detallada de la película de prueba ${template.t}. En esta emocionante aventura, los protagonistas se enfrentarán a desafíos inesperados, viajando por mundos fantásticos y luchando por defender sus ideales contra fuerzas oscuras. Una experiencia cinematográfica imperdible para disfrutar con toda la familia en las salas de Supercines.`,
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        schedules: movieSchedules
      });
    }

    // Generate 15 Snack Products
    const baseProducts = [
      { name: 'Combo Simple', price: 6.50, cat: 'cat2', desc: '1 Canguil Mediano + 1 Bebida Mediana' },
      { name: 'Combo Pareja', price: 11.50, cat: 'cat2', desc: '1 Canguil Grande + 2 Bebidas Medianas' },
      { name: 'Combo Familiar', price: 18.00, cat: 'cat2', desc: '2 Canguiles Medianos + 3 Bebidas Medianas + 1 Hot Dog' },
      { name: 'Coca-Cola Personal', price: 2.25, cat: 'cat3', desc: 'Bebida fría refrescante de 500ml' },
      { name: 'Fanta Mediana', price: 2.75, cat: 'cat3', desc: 'Bebida gaseosa sabor a naranja' },
      { name: 'Agua Mineral', price: 1.80, cat: 'cat3', desc: 'Agua natural sin gas' },
      { name: 'Café Expreso', price: 1.95, cat: 'cat4', desc: 'Café caliente recién filtrado' },
      { name: 'Capuchino Mediano', price: 2.50, cat: 'cat4', desc: 'Café caliente espumoso con leche' },
      { name: 'Nacho Grande con Queso', price: 4.50, cat: 'cat5', desc: 'Tortillas de maíz con queso cheddar caliente' },
      { name: 'Hot Dog Súper', price: 3.50, cat: 'cat5', desc: 'Salchicha gigante en pan especial con salsas' },
      { name: 'Papas Fritas', price: 2.80, cat: 'cat5', desc: 'Papas fritas crocantes sabor original' },
      { name: 'M&Ms de Maní', price: 2.20, cat: 'cat6', desc: 'Chocolates confitados con maní' },
      { name: 'Gomitas de Fruta', price: 1.50, cat: 'cat6', desc: 'Dulces gomitas masticables' },
      { name: 'Queso Extra', price: 1.00, cat: 'cat7', desc: 'Queso derretido para nachos' },
      { name: 'Jalapeños', price: 0.75, cat: 'cat7', desc: 'Rodajas de jalapeño picante' },
      { name: 'Canguil Grande', price: 4.80, cat: 'cat8', desc: 'Balde de canguil salado o dulce' },
      { name: 'Canguil Mediano', price: 3.80, cat: 'cat8', desc: 'Funda de canguil clásico' }
    ];

    baseProducts.forEach((p, idx) => {
      this.snackProducts.push({
        id: `snack_${idx + 1}`,
        categoryId: p.cat,
        name: p.name,
        price: p.price,
        description: p.desc,
        imageUrl: `https://picsum.photos/id/${100 + idx * 5}/200/200`
      });
    });

    // Make sure other categories have at least some products
    this.snackCategories.forEach(cat => {
      const hasProducts = this.snackProducts.some(p => p.categoryId === cat.id);
      if (!hasProducts) {
        this.snackProducts.push({
          id: `snack_auto_${cat.id}`,
          categoryId: cat.id,
          name: `Producto Especial ${cat.name}`,
          price: 5.99,
          description: `Descripción premium de producto de la categoría ${cat.name}`,
          imageUrl: 'https://picsum.photos/id/1080/200/200'
        });
      }
    });

    this.isInitialized = true;
  }

  static getCities(): City[] {
    this.initialize();
    return this.cities;
  }

  static getMovies(): Movie[] {
    this.initialize();
    return this.movies;
  }

  static getCinemas(): Cinema[] {
    this.initialize();
    return this.cinemas;
  }

  static getCinemasByCity(cityName: string): Cinema[] {
    this.initialize();
    return this.cinemas.filter(c => c.cityName === cityName);
  }

  static getSnackCategories(): SnackCategory[] {
    this.initialize();
    return this.snackCategories;
  }

  static getSnackProducts(categoryId?: string): SnackProduct[] {
    this.initialize();
    if (categoryId) {
      return this.snackProducts.filter(p => p.categoryId === categoryId);
    }
    return this.snackProducts;
  }

  static getMovieById(movieId: string): Movie | undefined {
    this.initialize();
    return this.movies.find(m => m.id === movieId);
  }
}
