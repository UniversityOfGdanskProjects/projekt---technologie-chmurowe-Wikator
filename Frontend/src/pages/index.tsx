'use client'

import {useEffect, useState, useReducer} from "react";
import MovieDto from "@/dtos/responses/movieDto";
import Link from "next/link";
import api from "@/api";
import {AxiosResponse} from "axios";
import {MoviesActionTypes, moviesReducer} from "@/reducers/moviesReducer";
import MovieOrdering from "@/app/components/movieOrdering";
import MovieFiltering from "@/app/components/movieFiltering";
import Paginator from "@/app/components/paginator";
import {useUserContext} from "@/contexts/userContext";
import ActorDto from "@/dtos/responses/actorDto";
import "./index.css";
import Movie from "@/app/components/Movie";
import mqttClient from "@/mqttClient";
import {useRouter} from "next/router";

export default function Home() {
  const [movies, dispatch] = useReducer(moviesReducer, []);
  const [sortBy, setSortBy] = useState('Popularity');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [titleFilter, setTitleFilter] = useState('');
  const [allActors, setAllActors] = useState<ActorDto[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [inTheaters, setInTheaters] = useState<boolean | null>(null);
  const [actorFilter, setActorFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const userContext = useUserContext();

  useEffect(() => {
    setLoading(true);
    api.get('/actor').then((response: AxiosResponse<ActorDto[]>) => setAllActors(response.data))
      .catch(error => console.error(error));
    api.get('/genre').then((response: AxiosResponse<string[]>) => setAllGenres(response.data))
      .catch(error => console.error(error));
    api.get(`movie?pageSize=3&pageNumber=${currentPage}&sortOrder=${sortOrder}&sortBy=${sortBy}` + (titleFilter !== '' ? `&title=${titleFilter}` : '') + (actorFilter !== '' ? `&actor=${actorFilter}` : '') + (genreFilter !== '' ? `&genre=${genreFilter}` : '') +  (inTheaters !== null ? `&inTheaters=${inTheaters}` : ''))
      .then((response: AxiosResponse<MovieDto[]>) => {
        movies.forEach(movie => mqttClient.unsubscribe(`movie/${movie.id}/updated-reviews`));
        dispatch({
          type: MoviesActionTypes.Set,
          payload: response.data
        });
        setLoading(false);
        response.data.forEach(movie => mqttClient.subscribe(`movie/${movie.id}/updated-reviews`));
        const newTotalPages = Number(JSON.parse(response.headers["pagination"])["totalPages"]);
        if (newTotalPages !== totalPages) {
          setTotalPages(newTotalPages);
        }
    }).catch(error => console.error(error));

    const handleMqttReviewReceived = (event: CustomEvent) => {
      dispatch({
        type: MoviesActionTypes.UpdateReviewData,
        reviewData: event.detail.data,
      });
    };

    const handleRouteChangeStart = () => {
      dispatch({type: MoviesActionTypes.UnsubscribeAll});
    };

    window.addEventListener('mqttReviewReceived', handleMqttReviewReceived as EventListener);
    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      window.removeEventListener('mqttReviewReceived', handleMqttReviewReceived as EventListener);
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [sortBy, sortOrder, titleFilter, currentPage, actorFilter, genreFilter, inTheaters, router.events, totalPages]);

  return (
    <>
      <section className="py-2 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Movies</h1>
            <p className="lead text-body-secondary">Here are most popular movies this day.</p>
            <p>
              {userContext.user ?
                <Link href={'/account/logout'}>
                  <button className="btn btn-primary my-2">Logout</button>
                </Link> : <>
                  <Link href={'/account/register'}>
                    <button className="btn btn-primary my-2">Register</button>
                  </Link>
                  <Link href={'/account/login'}>
                    <button className="btn btn-secondary my-2">Login</button>
                  </Link>
                </>
            }
            </p>
          </div>
        </div>
      </section>

    <div className="album py-5 bg-body-tertiary">
      <div className="container">
        <div className="row mb-5">
          <MovieOrdering
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}/>
          <MovieFiltering
            titleFilter={titleFilter}
            setTitleFilter={setTitleFilter}
            allActors={allActors}
            actorFilter={actorFilter}
            setActorFilter={setActorFilter}
            allGenres={allGenres}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            inTheaters={inTheaters}
            setInTheaters={setInTheaters} />
        </div>

        <div
          className={'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mb-3'}
          style={{
            opacity: loading ? 0.5 : 1,
            transition: 'opacity 0.2s ease-out',
          }}>
          {movies.map(movie =>
            <Movie key={movie.id} movie={movie} dispatch={dispatch} />
          )}
        </div>
        <Paginator currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </div>
    </div>
  </>
)
}
