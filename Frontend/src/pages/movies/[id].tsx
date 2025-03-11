import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import api from "@/api";
import MovieDetailsDto from "@/dtos/responses/movieDetailsDto";
import { AxiosResponse } from "axios";
import Comments from "@/app/components/comments";
import CommentDto from "@/dtos/responses/commentDto";
import AddCommentDto from "@/dtos/requests/addCommentDto";
import ReviewDto from "@/dtos/responses/reviewDto";
import mqttClient from "@/mqttClient";
import {useUserContext} from "@/contexts/userContext";
import YouTube from "react-youtube";

export default function MovieDetails() {
  const router = useRouter();
  const { user } = useUserContext();
  const [movieDetails, setMovieDetails] = useState<MovieDetailsDto | null>(null);

  useEffect(() => {

    if (!router.query.id) return;

    const newCommentPosted = (event: CustomEvent) => {
      if (event.detail.data.userId === user?.id) return;
      setMovieDetails(prevState => {
        if (!prevState) return prevState;
        return { ...prevState, comments: [...prevState.comments, event.detail.data] }
      });
    }

    const commentUpdated = (event: CustomEvent) => {
      if (event.detail.data.userId === user?.id) return;
      setMovieDetails(prevState => {
        if (!prevState) return prevState;
        return { ...prevState, comments: prevState.comments.map(c => c.id === event.detail.data.id ? event.detail.data : c) }
      });
    }

    const commentDeleted = (event: CustomEvent) => {
      setMovieDetails(prevState => {
        if (!prevState) return prevState;
        return { ...prevState, comments: prevState.comments.filter(c => c.id !== event.detail.data.commentId) }
      });
    }

    const handleLeavePage = () => {
      if (movieDetails) {
        mqttClient.unsubscribe(`movie/${movieDetails.id}/new-comment`);
        mqttClient.unsubscribe(`movie/${movieDetails.id}/updated-comment`);
        mqttClient.unsubscribe(`movie/${movieDetails.id}/deleted-comment`);
      }
    }

    api.get(`movie/${router.query.id}`)
      .then((response: AxiosResponse<MovieDetailsDto>) => {
        setMovieDetails(response.data);
        mqttClient.subscribe(`movie/${response.data.id}/new-comment`);
        mqttClient.subscribe(`movie/${response.data.id}/updated-comment`);
        mqttClient.subscribe(`movie/${response.data.id}/deleted-comment`);
        router.events.on('routeChangeStart', handleLeavePage);
      })
      .catch(error => console.error(error));

    window.addEventListener('mqttNewCommentReceived', newCommentPosted as EventListener);
    window.addEventListener('mqttUpdatedReviewReceived', commentUpdated as EventListener);
    window.addEventListener('mqttDeletedReviewReceived', commentDeleted as EventListener);

    return () => {
      window.removeEventListener('mqttNewCommentReceived', newCommentPosted as EventListener);
      window.removeEventListener('mqttUpdatedReviewReceived', commentUpdated as EventListener);
      window.removeEventListener('mqttDeletedReviewReceived', commentDeleted as EventListener);

      router.events.off('routeChangeStart', handleLeavePage)
      if (movieDetails) {
        mqttClient.unsubscribe(`movie/${movieDetails.id}/new-comment`);
        mqttClient.unsubscribe(`movie/${movieDetails.id}/updated-comment`);
        mqttClient.unsubscribe(`movie/${movieDetails.id}/deleted-comment`);
      }
    }
  }, [router.query.id, router.events, user?.id]);

  const reviewMovie = (score: number) => {
    if (!movieDetails) return;

    if (movieDetails.userReview) {
      api.put(`review/${movieDetails.userReview.id}`, { score: score })
        .then((response: AxiosResponse<ReviewDto>) => {
          const oldTotalScore = movieDetails.averageScore * movieDetails.reviewsCount;
          const newTotalScore = oldTotalScore - (movieDetails.userReview ? movieDetails.userReview.score : 0) + response.data.score;
          const newAverageReview = newTotalScore / movieDetails.reviewsCount;
          setMovieDetails({ ...movieDetails, userReview: { id: response.data.id, score: response.data.score }, averageScore: newAverageReview });
        })
        .catch(error => console.error(error));
      return;
    } else {
      api.post('review', { score: score, movieId: movieDetails.id })
        .then((response: AxiosResponse<ReviewDto>) => {
          const oldTotalScore = movieDetails.averageScore * movieDetails.reviewsCount;
          const newTotalScore = oldTotalScore + response.data.score;
          const newAverageReview = newTotalScore / (movieDetails.reviewsCount + 1);
          setMovieDetails({ ...movieDetails, userReview: { id: response.data.id, score: response.data.score }, reviewsCount: movieDetails.reviewsCount + 1, averageScore: newAverageReview });
        })
        .catch(error => console.error(error));
    }
  }

  const deleteReview = () => {
    if (!movieDetails || !movieDetails.userReview) return;

    api.delete(`review/${movieDetails.userReview.id}`)
      .then(() => {
        const oldTotalScore = movieDetails.averageScore * movieDetails.reviewsCount;
        const newTotalScore = oldTotalScore - (movieDetails.userReview ? movieDetails.userReview.score : 0);
        const newAverageReview = movieDetails.reviewsCount > 1 ? newTotalScore / (movieDetails.reviewsCount - 1) : 0;
        setMovieDetails({ ...movieDetails, userReview: null, reviewsCount: movieDetails.reviewsCount - 1, averageScore: newAverageReview });
      })
      .catch(error => console.error(error));
  }

  const addMovieToWatchlist = () => {
    if (!movieDetails) return;

    api.post(`movie/${movieDetails.id}/watchlist`)
      .then(() => {
        setMovieDetails({ ...movieDetails, onWatchlist: true });
      })
      .catch(error => console.error(error));
  }

  const removeMovieFromWatchlist = () => {
    if (!movieDetails) return;

    api.delete(`movie/${movieDetails.id}/watchlist`)
      .then(() => {
        setMovieDetails({ ...movieDetails, onWatchlist: false });
      })
      .catch(error => console.error(error));
  }

  const addCommentToMovie = (commentText: string) => {
    if (!movieDetails) return;

    const newComment: AddCommentDto = {
      text: commentText,
      movieId: movieDetails.id
    }

    api.post('comment', newComment)
      .then((response: AxiosResponse<CommentDto>) => {
        const newComments = [...movieDetails.comments, response.data];
        setMovieDetails({ ...movieDetails, comments: newComments });
      })
      .catch(error => console.error(error));
  }

  const deleteCommentFromMovie = (commentId: string) => {
    if (!movieDetails) return;

    api.delete(`comment/${commentId}`)
      .then(() => {
        const newComments = movieDetails.comments.filter(c => c.id !== commentId);
        setMovieDetails({ ...movieDetails, comments: newComments });
      })
      .catch(error => console.error(error));
  }

  const updateCommentInMovie = (commentId: string, commentText: string) => {
    if (!movieDetails) return;

    api.put(`comment/${commentId}`, { text: commentText })
      .then((response: AxiosResponse<CommentDto>) => {
        const newComments = movieDetails.comments.map(c => c.id === commentId ? response.data : c);
        setMovieDetails({ ...movieDetails, comments: newComments });
      })
      .catch(error => console.error(error));
  }

  const getYoutubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : undefined;
  }

  return (
    <div className="container mt-5">
      {movieDetails ? (
        <div className="card shadow-lg p-3 mb-5 bg-white rounded">
          <div className="row mb-4">
            <div className="col-md-8">
              <h1 className="display-3 text-primary font-weight-bold">{movieDetails.title}</h1>
              <p className="lead text-dark bg-light p-3">{movieDetails.description}</p>
              <p className="text-muted">{movieDetails.inTheaters ? 'In Theaters' : 'Not In Theaters'}</p>
              <p className="font-weight-bold text-muted">Average Score: {movieDetails.averageScore}</p>
              <p className="font-italic text-muted">Release Date: {new Date(movieDetails.releaseDate).toLocaleDateString()}</p>
              <p className="text-muted">Minimum Age: {movieDetails.minimumAge}</p>
              <p className="text-muted">{movieDetails.onWatchlist ?
                <>On Watchlist <button className={'btn btn-primary'} onClick={_ => removeMovieFromWatchlist()}>Remove</button> </> :
                <>Not On Watchlist <button className={'btn btn-primary'} onClick={_ => addMovieToWatchlist()}>Add</button> </>}
              </p>
            </div>
            <div className="col-md-4">
              {movieDetails.pictureUri &&
                <img src={movieDetails.pictureUri} alt={movieDetails.title} className="img-fluid mb-4"
                     style={{
                       width: '100%',
                       height: 'auto',
                     }}/>}
            </div>
          </div>
          <div className="mb-4">
            {movieDetails.trailerUrl && (
              <div className="embed-responsive embed-responsive-16by9">
                <YouTube videoId={getYoutubeVideoId(movieDetails.trailerUrl)} className="embed-responsive-item" />
              </div>
            )}
          </div>
          <div>
            <h3>Rate this movie (your current score: {movieDetails.userReview ? movieDetails.userReview.score : 'None'})</h3>
            <div className="btn-group pb-3" role="group" aria-label="Rate this movie">
              {[1, 2, 3, 4, 5].map((score) => (
                <button key={score} className={'btn btn-primary'} onClick={_ => reviewMovie(score)}>{score}</button>
              ))}
            </div>
            <br />
            <button className={`btn btn-danger ${!movieDetails.userReview ? ' disabled' : ''}`} onClick={_ => deleteReview()}>Delete</button>
          </div>
          <div>
            <h2>Comments</h2>
            <Comments
              comments={movieDetails.comments}
              onAddComment={addCommentToMovie}
              onCommentDelete={deleteCommentFromMovie}
              onUpdateComment={updateCommentInMovie}/>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}
