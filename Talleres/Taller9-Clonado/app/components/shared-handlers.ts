import { Frame, Page, View } from '@nativescript/core';

/** Shared handler for city-selector Repeater tap. */
export function onCityItemTap(args: { view?: { bindingContext?: string }; object?: { bindingContext?: string } }) {
  const page = Frame.topmost().currentPage as Page;
  const vm = page.bindingContext as { selectCity?: (city: string) => void };
  const city = (args.view?.bindingContext ?? args.object?.bindingContext) as string;

  if (vm?.selectCity && city) {
    vm.selectCity(city);
  }
}

/** Absorb tap inside modal box to prevent closing overlay. */
export function onModalClick() {
  // intentionally empty
}

/** Scale feedback when tapping list / grid cards. */
export function onCardLoaded(args: { object: View }) {
  const view = args.object;
  view.on('tap', () => {
    view.animate({
      scale: { x: 0.96, y: 0.96 },
      duration: 80
    }).then(() =>
      view.animate({
        scale: { x: 1, y: 1 },
        duration: 120
      })
    );
  });
}
