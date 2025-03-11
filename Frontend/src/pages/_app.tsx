'use client';

import type { AppProps } from 'next/app'
import Layout from "@/app/layout";
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContextProvider, {useUserContext} from "@/contexts/userContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import NotificationCountContextProvider from "@/contexts/notificationCountContext";
import {useEffect} from "react";
import api from "@/api";
import {AxiosResponse} from "axios";
import MovieDto from "@/dtos/responses/movieDto";
import mqttClient from "@/mqttClient";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <UserContextProvider>
      <NotificationCountContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationCountContextProvider>
    </UserContextProvider>
  )
}