export default interface NotificationDto {
  id: string;
  isRead: boolean;
  createdAt: Date;
  commentUsername: string;
  commentText: string;
  movieId: string;
  movieTitle: string;
}
