import { EventData, Page, Observable, Frame, ApplicationSettings, Dialogs } from '@nativescript/core';
import { MockDataService } from '../../services/mock-data.service';
import { Movie } from '../../models/movie';
import { Cinema } from '../../models/cinema';
import { SnackCategory } from '../../models/snack-category';
import { SnackProduct } from '../../models/snack-product';

export class CarteleraViewModel extends Observable {
  private _currentTab = 0;
  private _isGridView = false;
  private _selectedCity = 'Ambato';
  private _headerTitle = 'Cartelera';
  private _searchQuery = '';
  private _isSearchActive = false;
  private _isCityModalVisible = false;

  private _movies: Movie[] = [];
  private _filteredMovies: Movie[] = [];
  private _cities: string[] = [];
  private _cinemas: Cinema[] = [];
  private _filteredCinemas: Cinema[] = [];

  private _snackCategories: SnackCategory[] = [];
  private _selectedCategoryId = 'cat1';
  private _filteredSnacks: SnackProduct[] = [];
  private _snackCategoriesWithState: Array<{id: string; name: string; iconName?: string; isActive: boolean}> = [];

  // Login Form properties
  private _emailInput = '';
  private _passwordInput = '';
  private _isLoggedIn = false;
  private _loggedUserEmail = '';

  constructor() {
    super();

    // Initialize mock data source
    MockDataService.initialize();

    // Load selected city from persistent settings
    const savedCity = ApplicationSettings.getString('selectedCity');
    if (savedCity) {
      this._selectedCity = savedCity;
    }

    // Load lists
    this._cities = MockDataService.getCities().map(c => c.name);
    this._movies = MockDataService.getMovies();
    this._filteredMovies = this._movies;

    this._cinemas = MockDataService.getCinemas();
    this.updateFilteredCinemas();

    this._snackCategories = MockDataService.getSnackCategories();
    this.updateSnackCategoriesWithState();
    this.updateFilteredSnacks();



    // Check login state
    this._isLoggedIn = ApplicationSettings.getBoolean('isLoggedIn', false);
    this._loggedUserEmail = ApplicationSettings.getString('loggedUserEmail', '');
  }

  // Getters & Setters
  get currentTab(): number {
    return this._currentTab;
  }

  set currentTab(val: number) {
    if (this._currentTab !== val) {
      this._currentTab = val;
      this.notifyPropertyChange('currentTab', val);
      this.updateHeaderTitle();

      // Deactivate search when switching tabs
      this.isSearchActive = false;
      this.searchQuery = '';
    }
  }

  get isGridView(): boolean {
    return this._isGridView;
  }

  set isGridView(val: boolean) {
    if (this._isGridView !== val) {
      this._isGridView = val;
      this.notifyPropertyChange('isGridView', val);
    }
  }

  get selectedCity(): string {
    return this._selectedCity;
  }

  set selectedCity(val: string) {
    if (this._selectedCity !== val) {
      this._selectedCity = val;
      this.notifyPropertyChange('selectedCity', val);
      ApplicationSettings.setString('selectedCity', val);

      // Update city dependent content
      this.updateFilteredCinemas();
    }
  }

  get headerTitle(): string {
    return this._headerTitle;
  }

  set headerTitle(val: string) {
    if (this._headerTitle !== val) {
      this._headerTitle = val;
      this.notifyPropertyChange('headerTitle', val);
    }
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(val: string) {
    if (this._searchQuery !== val) {
      this._searchQuery = val;
      this.notifyPropertyChange('searchQuery', val);
    }
  }

  get isSearchActive(): boolean {
    return this._isSearchActive;
  }

  set isSearchActive(val: boolean) {
    if (this._isSearchActive !== val) {
      this._isSearchActive = val;
      this.notifyPropertyChange('isSearchActive', val);
    }
  }

  get isCityModalVisible(): boolean {
    return this._isCityModalVisible;
  }

  set isCityModalVisible(val: boolean) {
    if (this._isCityModalVisible !== val) {
      this._isCityModalVisible = val;
      this.notifyPropertyChange('isCityModalVisible', val);
    }
  }

  // Lists
  get filteredMovies(): Movie[] {
    return this._filteredMovies;
  }

  get cities(): string[] {
    return this._cities;
  }

  get filteredCinemas(): Cinema[] {
    return this._filteredCinemas;
  }

  get snackCategories(): SnackCategory[] {
    return this._snackCategories;
  }

  get snackCategoriesWithState(): Array<{id: string; name: string; iconName?: string; isActive: boolean}> {
    return this._snackCategoriesWithState;
  }


  get selectedCategoryId(): string {
    return this._selectedCategoryId;
  }

  set selectedCategoryId(val: string) {
    if (this._selectedCategoryId !== val) {
      this._selectedCategoryId = val;
      this.notifyPropertyChange('selectedCategoryId', val);
      this.updateFilteredSnacks();
      this.updateSnackCategoriesWithState();
    }
  }

  get filteredSnacks(): SnackProduct[] {
    return this._filteredSnacks;
  }

  // Login variables
  get emailInput(): string {
    return this._emailInput;
  }

  set emailInput(val: string) {
    if (this._emailInput !== val) {
      this._emailInput = val;
      this.notifyPropertyChange('emailInput', val);
    }
  }

  get passwordInput(): string {
    return this._passwordInput;
  }

  set passwordInput(val: string) {
    if (this._passwordInput !== val) {
      this._passwordInput = val;
      this.notifyPropertyChange('passwordInput', val);
    }
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  set isLoggedIn(val: boolean) {
    if (this._isLoggedIn !== val) {
      this._isLoggedIn = val;
      this.notifyPropertyChange('isLoggedIn', val);
    }
  }

  get loggedUserEmail(): string {
    return this._loggedUserEmail;
  }

  set loggedUserEmail(val: string) {
    if (this._loggedUserEmail !== val) {
      this._loggedUserEmail = val;
      this.notifyPropertyChange('loggedUserEmail', val);
    }
  }

  // Logic methods
  private updateHeaderTitle() {
    const titles = ['Cartelera', 'Cines', 'Bar de Comidas', 'SuperPuntos', 'Mis Compras', 'Ingresar', 'Más'];
    this.headerTitle = titles[this._currentTab];
  }

  private updateFilteredCinemas() {
    this._filteredCinemas = MockDataService.getCinemasByCity(this._selectedCity);
    this.notifyPropertyChange('filteredCinemas', this._filteredCinemas);
  }

  private updateFilteredSnacks() {
    this._filteredSnacks = MockDataService.getSnackProducts(this._selectedCategoryId);
    this.notifyPropertyChange('filteredSnacks', this._filteredSnacks);
  }

  private updateSnackCategoriesWithState() {
    this._snackCategoriesWithState = this._snackCategories.map(cat => ({
      ...cat,
      isActive: cat.id === this._selectedCategoryId
    }));
    this.notifyPropertyChange('snackCategoriesWithState', this._snackCategoriesWithState);
  }

  // Tab Selection
  selectTabPeliculas() { this.currentTab = 0; }
  selectTabCines() { this.currentTab = 1; }
  selectTabBar() { this.currentTab = 2; }
  selectTabPuntos() { this.currentTab = 3; }
  selectTabCompras() { this.currentTab = 4; }
  selectTabLogin() { this.currentTab = 5; }
  selectTabMas() { this.currentTab = 6; }

  // Toggle mode & search
  toggleViewMode(args: any) {
    this.isGridView = !this.isGridView;
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    if (!this.isSearchActive) {
      this.searchQuery = '';
      this.filterMoviesList();
    }
  }

  onSearchChange(args: any) {
    const text = args.value || '';
    this.searchQuery = text;
    this.filterMoviesList();
  }

  private filterMoviesList() {
    if (!this._searchQuery.trim()) {
      this._filteredMovies = this._movies;
    } else {
      const query = this._searchQuery.toLowerCase();
      this._filteredMovies = this._movies.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.englishTitle.toLowerCase().includes(query) ||
        m.genre.toLowerCase().includes(query)
      );
    }
    this.notifyPropertyChange('filteredMovies', this._filteredMovies);
  }

  // Modal handlers
  toggleCityModal() {
    this.isCityModalVisible = !this.isCityModalVisible;
  }

  onModalClick() {
    // Suppress tap bubble
  }

  selectCity(args: any) {
    // bindingContext del ítem es el string $value directamente
    const tappedCity = args.object.bindingContext as string;
    if (tappedCity) this.selectedCity = tappedCity;
    this.isCityModalVisible = false;
  }

  // Taps
  onMovieTap(args: any) {
    const movieId = args.object.movieId;

    // Navigate to Detail Page
    Frame.topmost().navigate({
      moduleName: 'views/movie-detail/movie-detail-page',
      context: { movieId: movieId },
      transition: {
        name: 'slide',
        duration: 350
      }
    });
  }

  onCinemaTap(args: any) {
    const cinemaId = args.object.cinemaId;
    const cinema = this._cinemas.find(c => c.id === cinemaId);
    if (cinema) {
      Dialogs.alert({
        title: cinema.name,
        message: `Dirección:\n${cinema.address}\n\n¡Te esperamos para vivir la mejor experiencia del cine!`,
        okButtonText: 'Cerrar'
      });
    }
  }

  selectSnackCategory(args: any) {
    const catId = args.object.categoryId;
    this.selectedCategoryId = catId;
  }

  onSnackTap(args: any) {
    const snackId = args.object.snackId;
    const snack = this._filteredSnacks.find(s => s.id === snackId);
    if (snack) {
      Dialogs.alert({
        title: snack.name,
        message: `${snack.description}\n\nPrecio: $${snack.price.toFixed(2)}`,
        okButtonText: 'Añadir al Carrito'
      });
    }
  }

  // Auth Submit
  onLoginSubmit() {
    if (!this._emailInput.trim() || !this._passwordInput.trim()) {
      Dialogs.alert({
        title: 'Error de ingreso',
        message: 'Por favor complete todos los campos.',
        okButtonText: 'Aceptar'
      });
      return;
    }

    // Mock Login Success
    this.isLoggedIn = true;
    this.loggedUserEmail = this._emailInput;
    ApplicationSettings.setBoolean('isLoggedIn', true);
    ApplicationSettings.setString('loggedUserEmail', this._emailInput);

    Dialogs.alert({
      title: '¡Bienvenido!',
      message: `Ha iniciado sesión correctamente con la cuenta: ${this._emailInput}`,
      okButtonText: 'Aceptar'
    });
  }

  onLogout() {
    this.isLoggedIn = false;
    this.loggedUserEmail = '';
    this.emailInput = '';
    this.passwordInput = '';
    ApplicationSettings.setBoolean('isLoggedIn', false);
    ApplicationSettings.setString('loggedUserEmail', '');

    Dialogs.alert({
      title: 'Sesión Cerrada',
      message: 'Ha cerrado su sesión correctamente.',
      okButtonText: 'Aceptar'
    });
  }

  onRegisterMock() {
    Dialogs.alert({
      title: 'Registro de Cuenta',
      message: 'La función de registro en línea no está disponible en este momento. Por favor, acérquese a atención al cliente en el complejo más cercano.',
      okButtonText: 'Cerrar'
    });
  }

  onForgotMock() {
    Dialogs.alert({
      title: 'Recuperar Contraseña',
      message: 'Se ha enviado un correo simulado de recuperación de contraseña a su dirección de correo electrónico.',
      okButtonText: 'Aceptar'
    });
  }

  onHeaderLogoTap() {
    // Navigate back to City Selection page
    Frame.topmost().navigate({
      moduleName: 'views/city-select/city-select-page',
      transition: {
        name: 'slideRight',
        duration: 350
      }
    });
  }

  // Mas menu links
  onMasChangeCity() {
    this.isCityModalVisible = true;
  }

  onMasInfo() {
    Dialogs.alert({
      title: 'Supercines Ecuador',
      message: 'Supercines es la cadena de cines más grande y moderna del Ecuador. Pertenece a Corporación El Rosado, y cuenta con complejos en las principales ciudades del país.',
      okButtonText: 'Cerrar'
    });
  }

  onMasTerms() {
    Dialogs.alert({
      title: 'Términos y Condiciones',
      message: 'Los términos y condiciones de uso regulan la compra de entradas y combos mediante nuestra plataforma móvil. Toda transacción es simulada en esta versión de pruebas.',
      okButtonText: 'Cerrar'
    });
  }

  onMasPrivacy() {
    Dialogs.alert({
      title: 'Políticas de Privacidad',
      message: 'Sus datos de prueba locales se almacenan de forma segura y temporal únicamente en el dispositivo.',
      okButtonText: 'Cerrar'
    });
  }
}

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new CarteleraViewModel();
}

// ─── Module-level handlers for Repeater item taps ────────────────────────────
// $parents['Page'].bindingContext falla en runtime dentro de Repeaters anidados
// en modales AbsoluteLayout. Estos exports resuelven el contexto correctamente.

function getVM(): CarteleraViewModel | null {
  const frame = Frame.topmost();
  if (!frame || !frame.currentPage) return null;
  return frame.currentPage.bindingContext as CarteleraViewModel;
}

export function onMovieTap(args: any) {
  const vm = getVM();
  if (vm) vm.onMovieTap(args);
}

export function onCinemaTap(args: any) {
  const vm = getVM();
  if (vm) vm.onCinemaTap(args);
}

export function selectCity(args: any) {
  const vm = getVM();
  if (vm) vm.selectCity(args);
}

export function selectSnackCategory(args: any) {
  const vm = getVM();
  if (vm) vm.selectSnackCategory(args);
}

export function onSnackTap(args: any) {
  const vm = getVM();
  if (vm) vm.onSnackTap(args);
}

// onScheduleTap pertenece exclusivamente a movie-detail-page.ts
