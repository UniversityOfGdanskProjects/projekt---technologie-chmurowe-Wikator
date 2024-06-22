import { useUserContext } from "@/contexts/userContext";
import Link from "next/link";
import {useNotificationCountContext} from "@/contexts/notificationCountContext";
import {useEffect} from "react";
import api from "@/api";
import {AxiosResponse} from "axios";
import mqttClient from "@/mqttClient";
import useCount from "@/hooks/useCount";
import toast from "react-hot-toast";

export default function Navbar() {
  const userContext = useUserContext();
  const {notificationCount} = useNotificationCountContext();
  const { count: usersTodayCount, setCount: setUsersTodayCount, incrementCount: incrementUsersTodayCount } = useCount(0);

  useEffect(() => {
    const source = new EventSource('http:/192.168.58.2:3100/api/sse');

    source.onmessage = function (event) {
      toast.success(`${event.data} is the most popular movie at the moment. Go check it out!`)
    };

    mqttClient.subscribe('users/new-today');
    api.get('/user/active-today-count').then((response: AxiosResponse<number>) => {
      setUsersTodayCount(response.data);
    });

    const handleMqttReceived = (_: CustomEvent) => {
      incrementUsersTodayCount();
    };

    window.addEventListener('mqttNewUserToday', handleMqttReceived as EventListener);

    return () => {
      mqttClient.unsubscribe('/users/new-today');
      window.removeEventListener('mqttNewUserToday', handleMqttReceived as EventListener);
    };
  }, [incrementUsersTodayCount, setUsersTodayCount]);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">MovieService</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href={'/'} className={'nav-link'}>Movies</Link>
            </li>
            <li className="nav-item">
              <Link href={'/chat'} className={'nav-link'}>Chat</Link>
            </li>
            {userContext.user && userContext.user.role === 'Admin' &&
              <li className="nav-item">
                <Link href={'/movies/new'} className={'nav-link'}>Add movie</Link>
              </li>}
            {userContext.user &&
            <>
              <li className="nav-item">
                <Link href={'/your-movies'} className={'nav-link'}>Your movies</Link>
              </li>
              <li className="nav-item">
                <Link href={'/ignoredMovies'} className={'nav-link'}>Ignored movies</Link>
              </li>
            </>}

            <li className="nav-item">
              <Link href={'/users'} className={'nav-link'}>Users</Link>
            </li>
            <li className="nav-item">
              <Link href={'/actors'} className={'nav-link'}>Actors</Link>
            </li>
            {userContext.user &&
              <>
                <li className="nav-item">
                  <Link href={'/notifications'} className={'nav-link'}>Notifications ({notificationCount})</Link>
                </li>
                <li className="nav-item">
                  <Link href={'/account/manage'} className={'nav-link'}>Manage Account</Link>
                </li>
              </>
            }

            <div className="ml-auto navbar-text">
              Users today: {usersTodayCount}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  )
}