import {
  NavigatedData,
  Page,
  Observable,
  Frame,
  Dialogs
} from '@nativescript/core';
import { MockDataService } from '../../services/mock-data.service';
import { Movie } from '../../models/movie';

export class SynopsisViewModel extends Observable {
  private _movie: Movie | null = null;

  constructor(movieId: string) {
    super();

    const found = MockDataService.getMovieById(movieId);
    if (found) {
      this._movie = found;
    }
  }

  // ─── Getters ─────────────────────────────────────────────────────────────────

  get movie(): Movie | null {
    return this._movie;
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────

  goBack() {
    Frame.topmost().goBack();
  }

  private navigateBackToCarteleraTab(tabIndex: number) {
    const frame = Frame.topmost();
    frame.goBack();

    // After goBack, Movie Detail page is active again.
    // Go back one more level to reach Cartelera.
    setTimeout(() => {
      frame.goBack();

      // Give Cartelera time to restore, then switch tab
      setTimeout(() => {
        const carteleraPage = frame.currentPage;
        if (carteleraPage && carteleraPage.bindingContext) {
          const vm = carteleraPage.bindingContext as any;
          if (typeof vm.currentTab !== 'undefined') {
            vm.currentTab = tabIndex;
          }
        }
      }, 100);
    }, 50);
  }

  navigateToCarteleraTab0() { this.navigateBackToCarteleraTab(0); }
  navigateToCarteleraTab1() { this.navigateBackToCarteleraTab(1); }
  navigateToCarteleraTab2() { this.navigateBackToCarteleraTab(2); }
  navigateToCarteleraTab3() { this.navigateBackToCarteleraTab(3); }
  navigateToCarteleraTab4() { this.navigateBackToCarteleraTab(4); }
  navigateToCarteleraTab5() { this.navigateBackToCarteleraTab(5); }
  navigateToCarteleraTab6() { this.navigateBackToCarteleraTab(6); }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  onTrailerTap() {
    const trailerUrl = this._movie?.trailerUrl;
    Dialogs.alert({
      title: 'Ver Trailer',
      message: trailerUrl
        ? `El trailer de "${this._movie!.title}" no está disponible sin conexión a internet en esta versión de demostración.\n\nURL: ${trailerUrl}`
        : 'El trailer no está disponible para esta película.',
      okButtonText: 'Cerrar'
    });
  }
}

// ─── Page event ──────────────────────────────────────────────────────────────

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object;

  // movieId is passed from movie-detail-page.ts via context
  const context = args.context as { movieId: string };
  const movieId = context?.movieId ?? '';

  page.bindingContext = new SynopsisViewModel(movieId);
}
