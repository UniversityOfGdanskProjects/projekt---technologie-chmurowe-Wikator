export default interface AddMovieDto {
    title: string;
    description: string;
    inTheaters: boolean;
    releaseDate: string;
    minimumAge: number;
    trailerUrl: string | null;
    fileContent: string | null;
    actorIds: string[];
    genres: string[];
}
