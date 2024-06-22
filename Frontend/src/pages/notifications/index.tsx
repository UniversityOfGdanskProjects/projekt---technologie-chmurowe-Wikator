import { useState, useEffect } from 'react';
import NotificationDto from '@/dtos/responses/notificationDto';
import api from '@/api';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import TimeAgo from 'react-timeago';
import './index.css';
import {useUserContext} from "@/contexts/userContext";
import {useNotificationCountContext} from "@/contexts/notificationCountContext";

export default function Index() {
  const {user, isAuthenticating} = useUserContext();
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const router = useRouter();
  const {notificationCount, setNotificationCount, decrementNotificationCount} = useNotificationCountContext();


  useEffect(() => {
    if (!isAuthenticating && user) {
      api.get('notification').then((response: AxiosResponse<NotificationDto[]>) => {
        setNotifications(response.data);
        setNotificationCount(response.data.filter(n => !n.isRead).length);
      });
    } else if (!isAuthenticating) {
      router.push('/account/login');
    }
  }, [isAuthenticating, router, setNotificationCount, user, notificationCount]);

  const navigateToMovie = (movieId: string, notificationId: string) => {
    api.put(`notification/${notificationId}`).then(() => {
      decrementNotificationCount();
    })
      .catch(error => console.error(error));
    router.push(`movies/${movieId}`);
  }

  const markAllAsRead = () => {
    api.put('notification')
      .then(() => {
        setNotifications(notifications.map((notification) => ({...notification, isRead: true})));
        setNotificationCount(0);
      })
      .catch(error => console.error(error));
  }

  const deleteAll = () => {
    api.delete('notification')
      .then(() => {
        setNotifications([]);
        setNotificationCount(0);
      })
      .catch(error => console.error(error));
  }

  return (
    <div className="container mt-4">
      <h1 className={'text-center mb-2'}>Notifications</h1>
      <div className="text-center mb-3">
        <button className={`btn btn-primary ${notifications.some(n => !n.isRead) ? '' : 'disabled'}`} onClick={markAllAsRead}>Mark all as read</button>
        <button className={`btn btn-danger ${notifications.length > 0 ? '' : 'disabled'}`} onClick={deleteAll}>Delete all</button>
      </div>

      <div className="row">
        {notifications.map((notification) => (
          <div key={notification.id} className={`col-md-4 mb-4 ${notification.isRead ? 'read' : 'unread'}`}>
            <div className="card notification-card" onClick={() => navigateToMovie(notification.movieId, notification.id)}>
              <div className="card-body">
                <h5 className="card-title">
                  {notification.commentUsername} commented on {notification.movieTitle}:
                </h5>
                <p className="card-text">{notification.commentText}</p>
                <TimeAgo component="p" className="card-footer" date={notification.createdAt} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
