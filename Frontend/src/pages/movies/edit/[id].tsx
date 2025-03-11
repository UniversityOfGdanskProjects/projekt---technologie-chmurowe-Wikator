import { useRouter } from "next/router";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditMovieDto from "@/dtos/requests/editMovieDto";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import api from "@/api";
import MovieDetailsDto from "@/dtos/responses/movieDetailsDto";
import ActorDto from "@/dtos/responses/actorDto";
import readFileAsByteArray from "@/readFileAsByteArray";
import PictureForm from "@/app/forms/PictureForm";
import toast from "react-hot-toast";

interface MovieInitialValues {
    Title: string;
    Description: string;
    InTheaters: boolean;
    ReleaseDate: string;
    MinimumAge: number;
    TrailerUri: string;
    ActorIds: string[];
    Genres: string[];
  }

  const movieInitialValues: MovieInitialValues = {
    Title: '',
    Description: '',
    InTheaters: false,
    ReleaseDate: '',
    MinimumAge: 0,
    TrailerUri: '',
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


export default function EditMoviePage() {
  const router = useRouter();
  const [pictureAbsoluteUri, setPictureAbsoluteUri] = useState<string | null>(null);
  const [actors, setActors] = useState<ActorDto[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const update = (dto: EditMovieDto) => {
    api.put(`movie/${router.query.id}`, dto)
      .then(_ => toast.success('Movie updated successfully'))
      .catch(error => console.error(error));
  }

  const formik = useFormik({
    initialValues: movieInitialValues,
    validationSchema: MovieFormSchema,
    onSubmit: async (values) => {
      const dto: EditMovieDto = {
        title: values.Title,
        description: values.Description,
        inTheaters: values.InTheaters,
        releaseDate: new Date(values.ReleaseDate).toISOString().split('T')[0],
        minimumAge: values.MinimumAge,
        trailerUrl: values.TrailerUri === '' ? null : values.TrailerUri,
        actorIds: values.ActorIds,
        genres: values.Genres
      };
      update(dto);
    },
  });

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    api.get('/actor')
      .then((response: AxiosResponse<ActorDto[]>) => {
        setActors(response.data);
      });
    api.get('/genre')
      .then((response: AxiosResponse<string[]>) => {
        setGenres(response.data);
      });

    api.get(`movie/${id}`)
      .then((response: AxiosResponse<MovieDetailsDto>) => {
        const movie = response.data;
        formik.setValues({
          Title: movie.title,
          Description: movie.description,
          InTheaters: movie.inTheaters,
          ReleaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
          MinimumAge: movie.minimumAge,
          TrailerUri: movie.trailerUrl ?? '',
          ActorIds: movie.actors.map(a => a.id),
          Genres: movie.genres
        });
        setPictureAbsoluteUri(movie.pictureUri);
      })
      .catch(error => console.error(error));
  }, [router.query]);

  const updatePicture = async (file: File | null) => {
    if (!file && pictureAbsoluteUri) {
      api.delete(`movie/${router.query.id}/picture`)
        .then(() => setPictureAbsoluteUri(null))
        .catch();
    } else {
      const fileContent = await readFileAsByteArray(file);
      if (pictureAbsoluteUri) {
        api.put(`movie/${router.query.id}/picture`, {fileContent})
        .then((response) => setPictureAbsoluteUri(response.data.pictureUri))
        .catch();
      } else {
        api.post(`movie/${router.query.id}/picture`, {fileContent})
        .then((response) => setPictureAbsoluteUri(response.data.pictureUri))
        .catch();
      }
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <form onSubmit={formik.handleSubmit} className="mx-4 p-4 shadow-lg rounded-lg" style={{width: '400px'}}>
        <h3 className="text-center mb-4">Edit Movie</h3>
            <div className="mb-3">
              <label htmlFor="Title" className="form-label">Title</label>
              <input type="text" className="form-control" id="Title" name="Title" value={formik.values.Title} onChange={formik.handleChange} />
              {formik.errors.Title ? <div className="alert alert-danger">{formik.errors.Title}</div> : null}
            </div>
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">Description</label>
              <textarea className="form-control" id="Description" name="Description" value={formik.values.Description} onChange={formik.handleChange} />
              {formik.errors.Description ? <div className="alert alert-danger">{formik.errors.Description}</div> : null}
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="InTheaters" name="InTheaters" checked={formik.values.InTheaters} onChange={formik.handleChange} />
              <label className="form-check-label" htmlFor="InTheaters">In Theaters</label>
              {formik.errors.InTheaters ? <div className="alert alert-danger">{formik.errors.InTheaters}</div> : null}
            </div>
            <div className="mb-3">
              <label htmlFor="ReleaseDate" className="form-label">Release Date</label>
              <input type="date" className="form-control" id="ReleaseDate" name="ReleaseDate" value={formik.values.ReleaseDate} onChange={formik.handleChange} />
              {formik.errors.ReleaseDate ? <div className="alert alert-danger">{formik.errors.ReleaseDate}</div> : null}
            </div>
            <div className="mb-3">
              <label htmlFor="MinimumAge" className="form-label">Minimum Age</label>
              <input type="number" className="form-control" id="MinimumAge" name="MinimumAge" value={formik.values.MinimumAge} onChange={formik.handleChange} />
              {formik.errors.MinimumAge ? <div className="alert alert-danger">{formik.errors.MinimumAge}</div> : null}
            </div>
            <div className="mb-3">
              <label htmlFor="TrailerUri" className="form-label">Trailer URL</label>
                <input type="text" className="form-control" id="TrailerUri" name="TrailerUri" value={formik.values.TrailerUri} onChange={formik.handleChange} />
                {formik.errors.TrailerUri ? <div className="alert alert-danger">{formik.errors.TrailerUri}</div> : null}
            </div>
            <div className={"row"}>
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
            <button type="submit" className="btn btn-primary w-100">Edit</button>
        </form>
        <PictureForm
          pictureAbsoluteUri={pictureAbsoluteUri}
          updatePicture={updatePicture} />
    </div>
  )
}