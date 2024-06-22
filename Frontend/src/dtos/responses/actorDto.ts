export default interface ActorDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  biography: string | null;
  pictureUri: string | null;
}