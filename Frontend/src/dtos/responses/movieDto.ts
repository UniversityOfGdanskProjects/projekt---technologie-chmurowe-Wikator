export default interface MovieDto {
  id: string,
  title: string,
  averageScore: number,
  minimumAge: number,
  pictureUri: string | null,
  onWatchlist: boolean,
  isFavourite: boolean,
  userReviewScore: number | null,
  reviewsCount: number,
}