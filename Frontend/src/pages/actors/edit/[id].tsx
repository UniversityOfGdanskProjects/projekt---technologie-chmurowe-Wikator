import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import api from "@/api";
import ActorDto from "@/dtos/responses/actorDto";
import readFileAsByteArray from "@/readFileAsByteArray";
import PictureForm from "@/app/forms/PictureForm";
import UpdateActorForm from "@/app/forms/UpdateActorForm";
import UpdateActorDto from "@/dtos/requests/UpdateActorDto";
import toast from "react-hot-toast";

export default function EditMoviePage() {
  const router = useRouter();
  const [pictureAbsoluteUri, setPictureAbsoluteUri] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<UpdateActorDto | null>(null);

  const update = (dto: UpdateActorDto) => {
    api.put(`actor/${router.query.id}`, dto)
      .then(() => toast.success('Actor updated successfully'))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;

    api.get(`actor/${id}`)
      .then((response: AxiosResponse<ActorDto>) => {
        const actor = response.data;
        setInitialValues({
          firstName: actor.firstName,
          lastName: actor.lastName,
          biography: actor.biography,
          dateOfBirth: actor.dateOfBirth.toString()
        });
        setPictureAbsoluteUri(actor.pictureUri);
      })
      .catch(error => console.error(error));
  }, [router.query]);

  const updatePicture = async (file: File | null) => {
    if (!file && pictureAbsoluteUri) {
      api.delete(`actor/${router.query.id}/picture`)
        .then(() => setPictureAbsoluteUri(null))
        .catch();
    } else {
      const fileContent = await readFileAsByteArray(file);
      if (pictureAbsoluteUri) {
        api.put(`actor/${router.query.id}/picture`, {fileContent})
          .then((response) => setPictureAbsoluteUri(response.data.pictureUri))
          .catch();
      } else {
        api.post(`actor/${router.query.id}/picture`, {fileContent})
          .then((response) => setPictureAbsoluteUri(response.data.pictureUri))
          .catch();
      }
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      {initialValues && <UpdateActorForm initialValues={initialValues} onPost={update} />}

      <PictureForm
        pictureAbsoluteUri={pictureAbsoluteUri}
        updatePicture={updatePicture} />
    </div>
  )
}