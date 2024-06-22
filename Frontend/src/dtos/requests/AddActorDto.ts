export default interface AddActorDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  biography: string | null;
  fileContent: string | null;
}