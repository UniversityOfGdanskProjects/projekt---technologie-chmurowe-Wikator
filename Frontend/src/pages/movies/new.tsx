import AddMovieDto from "@/dtos/requests/addMovieDto";
import MovieForm from "@/app/forms/MovieForm";
import api from "@/api";
import {useRouter} from "next/router";
import { useLayoutEffect } from "react";
import { useUserContext } from "@/contexts/userContext";

export default function New() {
  const router = useRouter();
  const {user, isAuthenticating} = useUserContext();

  useLayoutEffect(() => {
    if (!isAuthenticating && user) {
      if (user.role !== 'Admin')
        router.push('/');

    } else if (!isAuthenticating) {
      router.push('/account/login');
    }
  })


  const handleSubmit = async (values: AddMovieDto) => {
    try {
      await api.post('/movie', values);
      await router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <MovieForm onPost={handleSubmit} />
    </div>
  );
}