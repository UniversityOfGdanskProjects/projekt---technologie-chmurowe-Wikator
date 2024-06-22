export default interface CommentDto {
  id: string;
  movieId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
  isEdited: boolean;
}