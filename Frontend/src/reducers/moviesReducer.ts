import MovieDto from "@/dtos/responses/movieDto";
import mqttClient from "@/mqttClient";

export enum MoviesActionTypes {
  Set,
  Delete,
  AddToWatchlist,
  RemoveFromWatchlist,
  SetAsFavourite,
  RemoveAsFavourite,
  UpdateReviewData,
  UnsubscribeAll
}

export interface MoviesAction {
  type: MoviesActionTypes;
  id?: string;
  payload?: MovieDto[];
  reviewData?: { movieId: string, average: number, count: number };
}

export function moviesReducer(state: MovieDto[] = [], action: MoviesAction): MovieDto[] {
  switch (action.type) {
    case MoviesActionTypes.Set:
      if (!action.payload) return state;
      return action.payload;
    case MoviesActionTypes.Delete:
      return state.filter((movie: MovieDto) => movie.id !== action.id);
    case MoviesActionTypes.AddToWatchlist:
      return state.map((movie: MovieDto) => {
        if (movie.id === action.id) {
          return { ...movie, onWatchlist: true };
        }
        return movie;
      });
    case MoviesActionTypes.RemoveFromWatchlist:
      return state.map((movie: MovieDto) => {
        if (movie.id === action.id) {
          return { ...movie, onWatchlist: false };
        }
        return movie;
      });
    case MoviesActionTypes.SetAsFavourite:
      return state.map((movie: MovieDto) => {
        if (movie.id === action.id) {
          return { ...movie, isFavourite: true };
        }
        return movie;
      });
    case MoviesActionTypes.RemoveAsFavourite:
      return state.map((movie: MovieDto) => {
        if (movie.id === action.id) {
          return { ...movie, isFavourite: false };
        }
        return movie;
      });
    case MoviesActionTypes.UpdateReviewData:
      return state.map((movie: MovieDto) => {
        if (movie.id === action.reviewData!.movieId) {
          return { ...movie, averageScore: action.reviewData!.average, reviewsCount: action.reviewData!.count };
        }
        return movie;
      });
    case MoviesActionTypes.UnsubscribeAll:
      return state.map((movie: MovieDto) => {
        mqttClient.unsubscribe(`movie/${movie.id}/updated-reviews`);
        return movie;
      });
    default:
      return state;
  }
}