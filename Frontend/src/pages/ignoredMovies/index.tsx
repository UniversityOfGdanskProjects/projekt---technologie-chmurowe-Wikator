'use client'

import { useEffect, useState } from "react";
import api from "@/api";
import {AxiosResponse} from "axios";
import MovieDto from "@/dtos/responses/movieDto";
import {useUserContext} from "@/contexts/userContext";
import {useRouter} from "next/router";
import toast from "react-hot-toast";

export default function Index() {
    const [ignoredMovies, setIgnoredMovies] = useState<MovieDto[]>([]);
    const {user, isAuthenticating} = useUserContext();
    const router = useRouter();

    useEffect(() => {
        const fetchData = () => {
            api.get("movie/ignored")
                .then((response: AxiosResponse<MovieDto[]>) => setIgnoredMovies(response.data))
                .catch(error => console.error(error));
        }

        if (!isAuthenticating && user) {
            fetchData();
        } else if (!isAuthenticating) {
            router.push('/account/login');
        }
    }, [isAuthenticating, router, user]);

    const removeFromIgnored = (id: string) => {
        api.delete(`movie/${id}/ignored`)
            .then(() => {
                const newTitles = ignoredMovies.filter(title => title.id !== id);
                setIgnoredMovies(newTitles);
                toast.success('Movie removed from ignored.');
            })
            .catch(error => console.error(error));
    }

    return (
        <>
            <section className="py-2 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Ignored movies</h1>
                        <p className="lead text-body-secondary">Here are movies you ignore.</p>
                    </div>
                </div>
            </section>

            <div className="album py-5 bg-body-tertiary">
                <div className="container">

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {ignoredMovies.map(movie =>
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
                                                        onClick={() => removeFromIgnored(movie.id)}>Remove from ignored
                                                </button>
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
    )
}