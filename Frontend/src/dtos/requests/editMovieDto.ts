export default interface EditMovieDto {
    title: string;
    description: string;
    inTheaters: boolean;
    releaseDate: string;
    minimumAge: number;
    trailerUrl: string | null;
    actorIds: string[];
    genres: string[];
}
