/** Local drawable resources — no internet required. */
export const MOVIE_POSTERS = [
  'res://poster_1',
  'res://poster_2',
  'res://poster_3',
  'res://poster_4',
  'res://poster_5',
  'res://poster_6',
  'res://poster_7',
  'res://poster_8'
];

export const CINEMA_IMAGES = [
  'res://cinema_1',
  'res://cinema_2'
];

export const SNACK_IMAGES = [
  'res://snack_1',
  'res://snack_2',
  'res://snack_3',
  'res://snack_4',
  'res://snack_5'
];

export const SUPER_PUNTOS_BANNER = 'res://superpuntos_banner';

export function pickFrom<T>(items: T[], index: number): T {
  return items[index % items.length];
}
