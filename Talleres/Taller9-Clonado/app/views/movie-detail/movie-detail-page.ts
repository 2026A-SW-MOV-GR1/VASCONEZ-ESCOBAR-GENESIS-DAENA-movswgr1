import {
  EventData,
  Page,
  Observable,
  Frame,
  NavigatedData,
  ApplicationSettings,
  Dialogs
} from '@nativescript/core';
import { MockDataService } from '../../services/mock-data.service';
import { Movie } from '../../models/movie';

export class MovieDetailViewModel extends Observable {
  private _movie: Movie | null = null;
  private _selectedCity = 'Ambato';
  private _cities: string[] = [];
  private _isCityModalVisible = false;
  private _activeDateIndex = 0;
  private _showDateTodayText = '';
  private _showDateNextText = '';

  constructor(movieId: string) {
    super();

    // Load movie from service
    const found = MockDataService.getMovieById(movieId);
    if (found) {
      this._movie = found;
    }

    // Load saved city
    const savedCity = ApplicationSettings.getString('selectedCity');
    if (savedCity) {
      this._selectedCity = savedCity;
    }

    // Load city names list
    this._cities = MockDataService.getCities().map(c => c.name);

    // Build date labels from today
    const today = new Date();
    const next = new Date(today);
    next.setDate(today.getDate() + 1);

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    this._showDateTodayText = `${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]}`;
    this._showDateNextText = 'Siguiente día';
  }

  // ─── Getters & Setters ───────────────────────────────────────────────────────

  get movie(): Movie | null {
    return this._movie;
  }

  get selectedCity(): string {
    return this._selectedCity;
  }

  set selectedCity(value: string) {
    if (this._selectedCity !== value) {
      this._selectedCity = value;
      this.notifyPropertyChange('selectedCity', value);
      ApplicationSettings.setString('selectedCity', value);
    }
  }

  get cities(): string[] {
    return this._cities;
  }

  get isCityModalVisible(): boolean {
    return this._isCityModalVisible;
  }

  set isCityModalVisible(value: boolean) {
    if (this._isCityModalVisible !== value) {
      this._isCityModalVisible = value;
      this.notifyPropertyChange('isCityModalVisible', value);
    }
  }

  get activeDateIndex(): number {
    return this._activeDateIndex;
  }

  set activeDateIndex(value: number) {
    if (this._activeDateIndex !== value) {
      this._activeDateIndex = value;
      this.notifyPropertyChange('activeDateIndex', value);
    }
  }

  get showDateTodayText(): string {
    return this._showDateTodayText;
  }

  get showDateNextText(): string {
    return this._showDateNextText;
  }

  // ─── Navigation handlers ─────────────────────────────────────────────────────

  /**
   * Goes back to Cartelera (which remains in the navigation stack).
   * The existing CarteleraViewModel state (including selected tab) is preserved.
   */
  goBack() {
    Frame.topmost().goBack();
  }

  /**
   * Each navigateToCarteleraTabN goes back to Cartelera and then
   * programmatically selects the desired tab on the restored ViewModel.
   */
  private navigateBackAndSelectTab(tabIndex: number) {
    const frame = Frame.topmost();
    // Go back first — Cartelera is still alive in the stack
    frame.goBack();

    // After goBack the page is restored; schedule tab switch on next tick
    setTimeout(() => {
      const carteleraPage = frame.currentPage;
      if (carteleraPage && carteleraPage.bindingContext) {
        const vm = carteleraPage.bindingContext as any;
        if (typeof vm.currentTab !== 'undefined') {
          vm.currentTab = tabIndex;
        }
      }
    }, 100);
  }

  navigateToCarteleraTab0() { this.navigateBackAndSelectTab(0); }
  navigateToCarteleraTab1() { this.navigateBackAndSelectTab(1); }
  navigateToCarteleraTab2() { this.navigateBackAndSelectTab(2); }
  navigateToCarteleraTab3() { this.navigateBackAndSelectTab(3); }
  navigateToCarteleraTab4() { this.navigateBackAndSelectTab(4); }
  navigateToCarteleraTab5() { this.navigateBackAndSelectTab(5); }
  navigateToCarteleraTab6() { this.navigateBackAndSelectTab(6); }

  // ─── City modal ──────────────────────────────────────────────────────────────

  toggleCityModal() {
    this.isCityModalVisible = !this.isCityModalVisible;
  }

  onModalClick() {
    // Absorb tap to prevent bubbling to overlay close handler
  }

  selectCity(args: any) {
    const tappedCity: string = args.object.bindingContext as string;
    if (tappedCity && typeof tappedCity === 'string') {
      this.selectedCity = tappedCity;
    }
    this.isCityModalVisible = false;
  }

  // ─── Date tabs ───────────────────────────────────────────────────────────────

  selectDateToday() {
    this.activeDateIndex = 0;
  }

  selectDateNext() {
    this.activeDateIndex = 1;
  }

  // ─── Action buttons ──────────────────────────────────────────────────────────

  openSynopsis() {
    if (!this._movie) return;

    // Navigate to Synopsis page passing the movieId via context
    Frame.topmost().navigate({
      moduleName: 'views/synopsis/synopsis-page',
      context: { movieId: this._movie.id },
      transition: {
        name: 'slide',
        duration: 300
      }
    });
  }

  shareMovie() {
    if (!this._movie) return;

    Dialogs.alert({
      title: 'Compartir película',
      message: `"${this._movie.title}" — ¡Encuéntrala en los cines de Supercines Ecuador! 🎬`,
      okButtonText: 'Cerrar'
    });
  }

  onScheduleTap(args: any) {
    const time: string = args.object.scheduleTime;
    const room: string = args.object.scheduleRoom;

    Dialogs.confirm({
      title: `${time} — ${room}`,
      message: `¿Desea comprar entradas para esta función?\n\nPelícula: ${this._movie?.title ?? ''}\nComplejo: ${this._selectedCity}\nHorario: ${time}\nSala: ${room}`,
      okButtonText: 'Comprar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result) {
        Dialogs.alert({
          title: 'Compra Simulada',
          message: 'Esta es una demostración. La compra de entradas en línea no está disponible en esta versión.',
          okButtonText: 'Aceptar'
        });
      }
    });
  }
}

// ─── Page event ──────────────────────────────────────────────────────────────

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;

  // Read the movieId passed by Cartelera's onMovieTap()
  const context = args.context as { movieId: string };
  const movieId = context?.movieId ?? '';

  page.bindingContext = new MovieDetailViewModel(movieId);
}

// ─── Module-level handlers for Repeater item taps ────────────────────────────

function getVM(): MovieDetailViewModel | null {
  const frame = Frame.topmost();
  if (!frame || !frame.currentPage) return null;
  return frame.currentPage.bindingContext as MovieDetailViewModel;
}

export function onScheduleTap(args: any) {
  const vm = getVM();
  if (vm) vm.onScheduleTap(args);
}

export function selectCity(args: any) {
  const vm = getVM();
  if (vm) vm.selectCity(args);
}

export function onModalClick(args: any) {
  // Absorb tap — prevent bubbling to overlay
}
