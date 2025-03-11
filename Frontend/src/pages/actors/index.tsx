import {ActorsActionTypes, actorsReducer} from "@/reducers/actorsReducer";
import {useEffect, useReducer, useState} from "react";
import api from "@/api";
import {AxiosResponse} from "axios";
import ActorDto from "@/dtos/responses/actorDto";
import Link from "next/link";
import { useUserContext } from "@/contexts/userContext";

enum ActionSort {
  LastName,
  FirstName,
  DateOfBirth
}

export default function Actors() {
  const [actors, dispatch] = useReducer(actorsReducer, []);
  const userContext = useUserContext();
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [sort, setSort] = useState(ActionSort.LastName);

  useEffect(() => {
    api.get('actor').then((response: AxiosResponse<ActorDto[]>) => {
      dispatch({
        type: ActorsActionTypes.Set,
        payload: response.data
      })
    })
  }, []);

  const deleteActor = (id: string) => {
    api.delete(`actor/${id}`)
      .then(() => {
        dispatch({
          type: ActorsActionTypes.Delete,
          id: id
        })
      });
  }

  return (
    <div className="container mt-4">
      <h1 className={'text-center mb-2'}>Actors</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Last Name Filter"
                 value={lastNameFilter} onChange={e => setLastNameFilter(e.target.value)} />
        </div>
        <div className="col-md-6">
          <select className="form-control" value={sort} onChange={e => setSort(parseInt(e.target.value))}>
            <option value={ActionSort.LastName}>Last Name</option>
            <option value={ActionSort.FirstName}>First Name</option>
            <option value={ActionSort.DateOfBirth}>Date of Birth</option>
          </select>
        </div>
      </div>
      {userContext.user && userContext.user.role === 'Admin' &&
        <Link href={'/actors/new'} className={'btn btn-primary d-flex justify-content-center mb-2'}>New Actor</Link>}
      <div className="row">
        {actors.filter(a => a.lastName.includes(lastNameFilter)).sort((a, b) => {
          switch (sort) {
            case ActionSort.FirstName:
              return a.firstName < b.firstName ? -1 : 1;
            case ActionSort.DateOfBirth:
              return a.dateOfBirth < b.dateOfBirth ? -1 : 1;
            default:
              return a.lastName < b.lastName ? -1 : 1;
          }

        }).map(actor => (
          <div key={actor.id} className="col-md-4 mb-4">
            <div className="card">
              <img className="card-img-top"
                   style={{
                     width: '100%',
                     height: 'auto',
                   }}
                   src={actor.pictureUri || 'https://placehold.co/600x400/EEE/31343C'}
                   alt={'thumbnail'} />
              <div className="card-body">
                <h5 className="card-title">{`${actor.firstName} ${actor.lastName}`}</h5>
                <p className="card-text">{actor.biography}</p>
                <button
                  className="btn btn-danger btn-sm float-right"
                  onClick={_ => deleteActor(actor.id)}
                >
                  Delete
                </button>
                <Link href={`/actors/edit/${actor.id}`}
                      className={'btn btn-warning btn-sm float-right mr-2'}>Edit</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}