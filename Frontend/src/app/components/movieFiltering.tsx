import ActorDto from "@/dtos/responses/actorDto";
import React from "react";

export interface MovieFilteringProps {
  titleFilter: string;
  setTitleFilter: (titleFilter: string) => void;
  allActors: ActorDto[];
  actorFilter: string;
  setActorFilter: (actorFilter: string) => void;
  allGenres: string[];
  genreFilter: string;
  setGenreFilter: (genreFilter: string) => void;
  inTheaters: boolean | null;
  setInTheaters: (inTheaters: boolean | null) => void;
}

export default function MovieFiltering ({ titleFilter, setTitleFilter, allActors, actorFilter, setActorFilter, allGenres, genreFilter, setGenreFilter, inTheaters, setInTheaters }: MovieFilteringProps) {
  return (
    <>
      <div className="col-6">
        <label htmlFor="titleFilter" className="form-label">Title filter</label>
          <input type="text" className="form-control" id="titleFilter" placeholder="Title"
            value={titleFilter} onChange={e => setTitleFilter(e.target.value)}/>
      </div>
      <div className="col-6">
        <label htmlFor="actorFilter" className="form-label">Actor filter</label>
        <select className="form-select" value={actorFilter} id="actorFilter" aria-label="Actor filter" onChange={(e) => setActorFilter(e.target.value)}>
          <option value="">All</option>
          {allActors.map(actor => <option key={actor.id} value={actor.id}>{actor.firstName} {actor.lastName}</option>)}
        </select>
      </div>
      <div className="col-6">
        <label htmlFor="genreFilter" className="form-label">Genre filter</label>
        <select className="form-select" value={genreFilter} id="genreFilter" aria-label="Genre filter" onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="">All</option>
          {allGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
        </select>
      </div>
      <div className="col-6">
        <label htmlFor="inTheaters" className="form-label">In theaters</label>
        <select className="form-select" value={String(inTheaters)} id="inTheaters" aria-label="In theaters" onChange={(e) => setInTheaters(e.target.value === 'true' ? true : e.target.value === 'false' ? false : null)}>
          <option value={''}>All</option>
          <option value={'true'}>Yes</option>
          <option value={'false'}>No</option>
        </select>
      </div>
    </>
  )
}
