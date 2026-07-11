import { View } from '@nativescript/core';

/** Fade-in animation for views entering the screen. */
export function fadeIn(view: View, duration = 600): Promise<void> {
  view.opacity = 0;
  return view.animate({
    opacity: 1,
    duration,
    curve: 'easeOut'
  });
}

/** Scale-down / scale-up feedback when tapping cards. */
export function scaleTap(view: View, onComplete?: () => void): void {
  view.animate({
    scale: { x: 0.95, y: 0.95 },
    duration: 80,
    curve: 'easeOut'
  }).then(() =>
    view.animate({
      scale: { x: 1, y: 1 },
      duration: 120,
      curve: 'easeIn'
    })
  ).then(() => {
    if (onComplete) {
      onComplete();
    }
  }).catch(() => {
    if (onComplete) {
      onComplete();
    }
  });
}

/** Cross-fade transition when switching list / grid view modes. */
export function crossFadeViews(hideView: View, showView: View, duration = 250): Promise<void> {
  hideView.animate({ opacity: 0, duration, curve: 'easeIn' });
  showView.opacity = 0;
  showView.visibility = 'visible';
  return showView.animate({ opacity: 1, duration, curve: 'easeOut' });
}
