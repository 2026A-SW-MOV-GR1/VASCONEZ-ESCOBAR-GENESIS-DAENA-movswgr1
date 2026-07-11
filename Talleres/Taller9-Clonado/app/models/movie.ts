import { Schedule } from './schedule';

export interface Movie {
  id: string;
  title: string;
  englishTitle: string;
  language: string;
  duration: string;
  rating: string;
  posterUrl: string;
  label: string;
  genre: string;
  synopsis: string;
  trailerUrl?: string;
  schedules?: Schedule[];
}
