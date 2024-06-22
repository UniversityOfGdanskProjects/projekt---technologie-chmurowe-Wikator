import ActorDto from "./actorDto";
import CommentDto from "./commentDto";
import ReviewIdAndScoreDto from "./reviewIdAndScoreDto";

export default interface MovieDetailsDto {
  id: string;
  title: string;
  description: string;
  inTheaters: boolean;
  averageScore: number;
  trailerUrl: string | null;
  releaseDate: Date
  minimumAge: number;
  pictureUri: string | null;
  onWatchlist: boolean;
  isFavourite: boolean;
  userReview: ReviewIdAndScoreDto | null;
  reviewsCount: number;
  comments: CommentDto[];
  actors: ActorDto[];
  genres: string[];
}