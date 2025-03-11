import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import api from "@/api";
import {AxiosResponse} from "axios";
import NotificationDto from "@/dtos/responses/notificationDto";
import {useUserContext} from "@/contexts/userContext";
import MovieDto from "@/dtos/responses/movieDto";
import mqttClient from "@/mqttClient";
import toast from "react-hot-toast";
import useCount from "@/hooks/useCount";

type NotificationCountContextType = {
    notificationCount: number;
    setNotificationCount: (notificationCount: number) => void;
    decrementNotificationCount: () => void;
    triggerFavouriteMovieListChanged: () => void;
};

const NotificationCountContext = createContext<NotificationCountContextType | null>(null);
export const useNotificationCountContext = () => {
    const notificationCountContext: NotificationCountContextType | null = useContext(NotificationCountContext);
    if (!notificationCountContext)
      throw new Error('useNotificationCountContext must be used within a NotificationCountContextProvider');

    return notificationCountContext;
};

export default function NotificationCountContextProvider({children}: { children: ReactNode }) {
    const {count: notificationCount, setCount: setNotificationCount, incrementCount: incrementNotificationCount} = useCount(0)
    const {user, isAuthenticating} = useUserContext();
    const [favouriteMovieListChanged, setFavouriteMovieListChanged] = useState(false);
    const [favouriteMovieIds, setFavouriteMovieIds] = useState<string[]>([]);

    const decrementNotificationCount = () => {
      setNotificationCount(notificationCount - 1);
    }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user && !isAuthenticating) {
        api.get('notification').then((response: AxiosResponse<NotificationDto[]>) => {
          setNotificationCount(response.data.filter(n => !n.isRead).length);
        })
        .catch(error => console.error(error));
        api.get('movie/favourite').then((res: AxiosResponse<MovieDto[]>) => {
          favouriteMovieIds.forEach(id => mqttClient.unsubscribe(`notification/movie/${id}`));
          res.data.forEach(movie =>
            mqttClient.subscribe(`notification/movie/${movie.id}`))
          setFavouriteMovieIds(res.data.map(movie => movie.id));
        }).catch();
      }
    }

    const handleMqttNotificationReceived = (event: CustomEvent) => {
      toast.success(`${event.detail.commentUsername} commented on ${event.detail.movieTitle}!`);
      incrementNotificationCount();
    };

    window.addEventListener('mqttNotificationReceived', handleMqttNotificationReceived as EventListener);
  return () => {
    favouriteMovieIds.forEach(id => mqttClient.unsubscribe(`notification/movie/${id}`));
    window.removeEventListener('mqttNotificationReceived', handleMqttNotificationReceived as EventListener);
  };
  }, [isAuthenticating, user, favouriteMovieListChanged, incrementNotificationCount, setNotificationCount]);


  const triggerFavouriteMovieListChanged = () => {
    setFavouriteMovieListChanged(!favouriteMovieListChanged);
  }

    return (
      <NotificationCountContext.Provider
        value={{
          notificationCount,
          setNotificationCount,
          decrementNotificationCount,
          triggerFavouriteMovieListChanged}}>
        {children}
      </NotificationCountContext.Provider>);
}
