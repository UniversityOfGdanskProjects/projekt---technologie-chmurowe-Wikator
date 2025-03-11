import { useUserContext } from "@/contexts/userContext";
import MovieDto from "@/dtos/responses/movieDto";
import Link from "next/link";

export interface MovieButtonsProps {
  movie: MovieDto;
  favouriteMovie: (id: string) => void;
  unfavouriteMovie: (id: string) => void;
  addMovieToWatchlist: (id: string) => void;
  removeMovieFromWatchlist: (id: string) => void;
  deleteMovie: (id: string) => void;
  ignoreMovie: (id: string) => void;
}

export default function MovieButtons({ movie, favouriteMovie, unfavouriteMovie, addMovieToWatchlist, removeMovieFromWatchlist, deleteMovie, ignoreMovie }: MovieButtonsProps) {
  const userContext = useUserContext();

  return (
    <ul className="list-inline buttons animate text-center">
      {userContext.user &&
        <>
          <li className="list-inline-item">
          {movie.isFavourite ?
          <button type="button" className="btn btn-primary"
            onClick={_ => unfavouriteMovie(movie.id)}><i className="fa fa-heart-crack"></i></button>
            :
            <button type="button" className="btn btn-primary"
              onClick={_ => favouriteMovie(movie.id)}><i className="fa fa-heart"></i></button>
          }
        </li>
        <li className="list-inline-item">
          {movie.onWatchlist ?
          <button type="button" className="btn btn-primary"
            onClick={_ => removeMovieFromWatchlist(movie.id)}><i className="fa fa-eye-slash"></i></button>
            :
            <button type="button" className="btn btn-primary"
              onClick={_ => addMovieToWatchlist(movie.id)}><i className="fa fa-eye"></i></button>
          }
        </li>
        <li className="list-inline-item">
          <button type="button" className="btn btn-primary"
            onClick={_ => ignoreMovie(movie.id)}><i className="fa fa-times-circle"></i></button>
        </li>
      </>
    }
      
      <li className="list-inline-item">
        <Link href={`/movies/${movie.id}`} className="btn btn-primary">
          View
        </Link>
      </li>
      {userContext.user?.role === 'Admin' &&
        <>
          <li className="list-inline-item">
            <Link href={`/movies/edit/${movie.id}`} className="btn btn-primary">
              Edit
            </Link>
          </li>
          <li className="list-inline-item">
            <button type="button" className="btn btn-primary"
              onClick={_ => deleteMovie(movie.id)}>Delete</button>
          </li>
        </>
      }
    </ul>
  )
}
