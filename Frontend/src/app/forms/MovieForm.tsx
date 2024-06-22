import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddMovieDto from "@/dtos/requests/addMovieDto";
import readFileAsByteArray from "@/readFileAsByteArray";
import api from '@/api';
import { AxiosResponse } from 'axios';
import ActorDto from '@/dtos/responses/actorDto';

interface MovieFormProps {
  onPost: (values: AddMovieDto) => void;
}

interface InitialValues {
  Title: string;
  Description: string;
  InTheaters: boolean;
  ReleaseDate: string;
  MinimumAge: number;
  TrailerUri: string;
  File: File | null;
  ActorIds: string[];
  Genres: string[];
}

const initialValues: InitialValues = {
  Title: '',
  Description: '',
  InTheaters: false,
  ReleaseDate: '',
  MinimumAge: 0,
  TrailerUri: '',
  File: null,
  ActorIds: [],
  Genres: []
}

const MovieFormSchema = Yup.object().shape({
  Title: Yup.string().required('Title is required'),
  Description: Yup.string().required('Description is required'),
  InTheaters: Yup.boolean().required('Please specify if the movie is in theaters'),
  ReleaseDate: Yup.date().required('Release date is required'),
  MinimumAge: Yup.number().required('Minimum age is required').min(0).max(18),
  TrailerUri: Yup.string().url('Invalid URL'),
  File: Yup.mixed(),
  ActorIds: Yup.array().of(Yup.string()),
  Genres: Yup.array().of(Yup.string())
});

export default function MovieForm({ onPost }: MovieFormProps) {
  const [actors, setActors] = useState<ActorDto[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    api.get('/actor')
      .then((response: AxiosResponse<ActorDto[]>) => {
        setActors(response.data);
      });
    api.get('/genre')
      .then((response: AxiosResponse<string[]>) => {
        setGenres(response.data);
      });
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: MovieFormSchema,
    onSubmit: async (values) => {
      const fileContent = await readFileAsByteArray(values.File);
      const dto: AddMovieDto = {
        title: values.Title,
        description: values.Description,
        inTheaters: values.InTheaters,
        releaseDate: new Date(values.ReleaseDate).toISOString().split('T')[0],
        minimumAge: values.MinimumAge,
        trailerUrl: values.TrailerUri === '' ? null : values.TrailerUri,
        fileContent: fileContent,
        actorIds: values.ActorIds,
        genres: values.Genres
      };
      onPost(dto);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      formik.setFieldValue('File', event.currentTarget.files[0]);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <form onSubmit={formik.handleSubmit} className="p-4 shadow-lg rounded-lg" style={{width: '400px'}}>
        <h3 className="text-center mb-4">Create Movie</h3>
        <div className="mb-3">
          <label htmlFor="Title" className="form-label">Title</label>
          <input className="form-control" type="text" {...formik.getFieldProps('Title')} />
          {formik.touched.Title && formik.errors.Title && <div className="text-danger">{formik.errors.Title}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="Description" className="form-label">Description</label>
          <input className="form-control" type="text" {...formik.getFieldProps('Description')} />
          {formik.touched.Description && formik.errors.Description &&
            <div className="text-danger">{formik.errors.Description}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="InTheaters" className="form-label">In Theaters</label>
          <input className="form-check" type="checkbox" {...formik.getFieldProps('InTheaters')} />
          {formik.touched.InTheaters && formik.errors.InTheaters &&
            <div className="text-danger">{formik.errors.InTheaters}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="ReleaseDate" className="form-label">ReleaseDate</label>
          <input className="form-control" type="date" {...formik.getFieldProps('ReleaseDate')} />
          {formik.touched.ReleaseDate && formik.errors.ReleaseDate &&
            <div className="text-danger">{formik.errors.ReleaseDate}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="MinimumAge" className="form-label">Minimum Age</label>
          <input className="form-control" type="number" {...formik.getFieldProps('MinimumAge')} />
          {formik.touched.MinimumAge && formik.errors.MinimumAge &&
            <div className="text-danger">{formik.errors.MinimumAge}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="TrailerUri" className="form-label">Trailer Uri</label>
          <input className="form-control" type="text" {...formik.getFieldProps('TrailerUri')} />
          {formik.touched.TrailerUri && formik.errors.TrailerUri &&
            <div className="text-danger">{formik.errors.MinimumAge}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="file">Upload File</label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
          {formik.touched.File && formik.errors.File && (
            <div>{formik.errors.File}</div>
          )}
        </div>

        <div className="row">
          <div className="mb-3 col-6">
            <label htmlFor="ActorIds" className="form-label">Actors</label>
            <div className="form-group">
              {actors.map((actor: ActorDto) => (
                <div key={actor.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={actor.id}
                    name="selectedActors"
                    value={actor.id}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      const isChecked = e.target.checked;
                      formik.setFieldValue(
                        'ActorIds',
                        isChecked
                          ? [...formik.values.ActorIds, actor.id]
                          : formik.values.ActorIds.filter((val) => val !== actor.id)
                      );
                    }}
                    checked={formik.values.ActorIds.includes(actor.id)}
                  />
                  <label className="form-check-label" htmlFor={actor.id}>
                    {actor.firstName} {actor.lastName}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.ActorIds && formik.errors.ActorIds ? (
              <div className="text-danger">{formik.errors.ActorIds}</div>
            ) : null}
          </div>

          <div className="mb-3 col-6">
            <label htmlFor="Genres" className="form-label">Genres</label>
            <div className="form-group">
              {genres.map((genre: string) => (
                <div key={genre} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={genre}
                    name="selectedActors"
                    value={genre}
                    onChange={(e) => {
                      console.log(e.target.checked);
                      const isChecked = e.target.checked;
                      formik.setFieldValue(
                        'Genres',
                        isChecked
                          ? [...formik.values.Genres, genre]
                          : formik.values.Genres.filter((val) => val !== genre)
                      );
                    }}
                    checked={formik.values.Genres.includes(genre)}
                  />
                  <label className="form-check-label" htmlFor={genre}>
                    {genre}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.Genres && formik.errors.Genres ? (
              <div className="text-danger">{formik.errors.Genres}</div>
            ) : null}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">Create</button>
      </form>
    </div>
  );
}
