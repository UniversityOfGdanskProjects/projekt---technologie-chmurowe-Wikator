import AddActorDto from "@/dtos/requests/AddActorDto";
import {useRouter} from "next/router";
import api from "@/api";
import AddActorForm from "@/app/forms/AddActorForm";
import { useUserContext } from "@/contexts/userContext";
import { useLayoutEffect } from "react";

export default function NewMovie() {
  const router = useRouter();
  const {user, isAuthenticating} = useUserContext();

  useLayoutEffect(() => {
    if (!isAuthenticating && user) {
      if (user.role !== 'Admin')
        router.push('/');

    } else if (!isAuthenticating) {
      router.push('/account/login');
    }
  }, [isAuthenticating, router, user])

  const onPost = async (dto: AddActorDto) => {
    await api.post('actor', dto)
      .then(() => {
        router.push('/actors');
      })
      .catch(error => console.error(error));
  }

  return (
    <div>
      <AddActorForm onPost={onPost} />
    </div>
  );
}