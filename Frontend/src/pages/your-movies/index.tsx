import {useEffect, useReducer} from "react";
import MovieDto from "@/dtos/responses/movieDto";
import api from "@/api";
import {AxiosResponse} from "axios";
import {MoviesActionTypes, moviesReducer} from "@/reducers/moviesReducer";
import {useUserContext} from "@/contexts/userContext";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Index() {
  const [watchlist, dispatchWatchlist] = useReducer(moviesReducer, []);
  const [favourites, dispatchFavourites] = useReducer(moviesReducer, []); // [1
  const {user, isAuthenticating} = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const fetchData = () => {
      api.get("movie/watchlist")
        .then((response: AxiosResponse<MovieDto[]>) => dispatchWatchlist({
          type: MoviesActionTypes.Set,
          payload: response.data
        }))
        .catch(error => console.error(error));

      api.get("movie/favourite")
        .then((response: AxiosResponse<MovieDto[]>) => dispatchFavourites({
          type: MoviesActionTypes.Set,
          payload: response.data
        }))
        .catch(error => console.error(error));
    }

    if (!isAuthenticating && user) {
      fetchData();
    } else if (!isAuthenticating) {
      router.push('/account/login');
    }
  }, [isAuthenticating, router, user]);

  const removeMovieFromWatchlist = (id: string) => {
    api.delete(`movie/${id}/watchlist`)
      .then(() => {
        dispatchWatchlist({
          type: MoviesActionTypes.Delete,
          id: id
        });
        toast.success('Movie removed from watchlist.');
      })
      .catch(error => console.error(error));
  }

  const removeMovieFromFavourites = (id: string) => {
    api.delete(`movie/${id}/favourite`)
      .then(() => {
        dispatchFavourites({
          type: MoviesActionTypes.Delete,
          id: id
        });
        toast.success('Movie removed from favourites.');
      })
      .catch(error => console.error(error));
  }

  return (
    <>
      {watchlist.length > 0 &&
        <>
          <section className="py-2 text-center container">
            <div className="row py-lg-5">
              <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Watchlist</h1>
                <p className="lead text-body-secondary">Here are movies on your watchlist.</p>
              </div>
            </div>
          </section>

          <div className="album py-5 bg-body-tertiary">
            <div className="container">

              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {watchlist.map(movie =>
                  <div key={movie.id} className="col">
                    <div className="card shadow-sm">
                      <img className="card-img-top"
                           style={{
                             width: '100%',
                             height: 'auto',
                           }}
                           src={movie.pictureUri || 'https://placehold.co/600x400/EEE/31343C'}
                           alt={'thumbnail'}/>
                      <div className="card-body">
                        <p className="card-text">{movie.title}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={() => removeMovieFromWatchlist(movie.id)}>Remove from watchlist
                            </button>
                            <Link className="btn btn-sm btn-outline-secondary" href={`movies/${movie.id}`}>Details</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      }

      {favourites.length > 0 &&
        <>
          <section className="py-2 text-center container">
            <div className="row py-lg-5">
              <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Favourites</h1>
                <p className="lead text-body-secondary">Here are movies on your favourite list.</p>
              </div>
            </div>
          </section>

          <div className="album py-5 bg-body-tertiary">
            <div className="container">

              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {favourites.map(movie =>
                  <div key={movie.id} className="col">
                    <div className="card shadow-sm">
                      <img className="card-img-top"
                           style={{
                              width: '100%',
                              height: 'auto',
                            }}
                             src={movie.pictureUri || 'https://placehold.co/600x400/EEE/31343C'}
                             alt={'thumbnail'} />
                      <div className="card-body">
                        <p className="card-text">{movie.title}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    onClick={() => removeMovieFromFavourites(movie.id)}>Remove from favourite list
                            </button>
                            <Link className="btn btn-sm btn-outline-secondary" href={`movies/${movie.id}`}>Details</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>}
    </>
  )
}