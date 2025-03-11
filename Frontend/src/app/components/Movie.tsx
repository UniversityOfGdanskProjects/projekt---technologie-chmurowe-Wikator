import MovieDto from "@/dtos/responses/movieDto";
import api from "@/api";
import { MoviesAction, MoviesActionTypes } from "@/reducers/moviesReducer";
import MovieButtons from "./MovieButtons";
import {useNotificationCountContext} from "@/contexts/notificationCountContext";
import toast from "react-hot-toast";


export interface MovieProps {
  movie: MovieDto;
  dispatch: (movie: MoviesAction) => void;
}

export default function Movie({ movie, dispatch }: MovieProps) {
  const { triggerFavouriteMovieListChanged } = useNotificationCountContext();

  const ignoreMovie = () => {
    api.post(`movie/${movie.id}/ignored`)
      .then(() => {
        dispatch({
          type: MoviesActionTypes.Delete,
          id: movie.id
        });
        toast.success('Movie ignored');
      })
      .catch();
  }

  const deleteMovie = () => {
    api.delete(`movie/${movie.id}`)
      .then(() => {
        dispatch({
          type: MoviesActionTypes.Delete,
          id: movie.id
        });
        toast.success('Movie deleted');
      })
      .catch();
  }

  const addMovieToWatchlist = () => {
    api.post(`movie/${movie.id}/watchlist`)
      .then(() => {
        dispatch({
          type: MoviesActionTypes.AddToWatchlist,
          id: movie.id
        });
        toast.success('Movie added to watchlist')
      })
      .catch();

  }

  const favouriteMovie = () => {
    api.post(`movie/${movie.id}/favourite`)
      .then(() => {
        dispatch({
          type: MoviesActionTypes.SetAsFavourite,
          id: movie.id
        });
        triggerFavouriteMovieListChanged();
        toast.success('Movie added to favourites')
      })
      .catch();
  }

  const unfavouriteMovie = () => {
    api.delete(`movie/${movie.id}/favourite`)
      .then(() => {
        dispatch({
          type: MoviesActionTypes.RemoveAsFavourite,
          id: movie.id
        });
        triggerFavouriteMovieListChanged();
        toast.success('Movie removed from favourites')
      })
      .catch();
  }

  const removeMovieFromWatchlist = () => {
    api.delete(`movie/${movie.id}/watchlist`)
      .then(() => {
        dispatch({
          type: MoviesActionTypes.RemoveFromWatchlist,
          id: movie.id
        });
        toast.success('Movie removed from watchlist')
      })
      .catch();
  }

  return (
    <div key={movie.id} className="col">
      <div className="card movie-card shadow-sm">
        <div className="movie-card-img-wrapper">
          <img className="card-img-top" sizes="100vw"
                 style={{
                   width: '100%',
                   height: 'auto',
                 }}
                 src={movie.pictureUri || 'https://placehold.co/1290x1920/EEE/31343C'}
                 alt={'thumbnail'} />
          <MovieButtons
            movie={movie}
            ignoreMovie={ignoreMovie}
            deleteMovie={deleteMovie}
            addMovieToWatchlist={addMovieToWatchlist}
            favouriteMovie={favouriteMovie}
            unfavouriteMovie={unfavouriteMovie}
            removeMovieFromWatchlist={removeMovieFromWatchlist} />
        </div>

        <div className="card-body">
          <h5 className="card-title">{movie.title}</h5>
          <p className="card-text">Average score - {movie.averageScore.toFixed(2)}/5 ({movie.reviewsCount} {movie.reviewsCount === 1 ? 'review' : 'reviews'})
            </p>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-body-secondary">PEGI - {movie.minimumAge}</small>
          </div>
        </div>
      </div>
    </div>
  )
}
