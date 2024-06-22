import React from 'react';
import LoginForm from "@/app/forms/LoginForm";
import {useRouter} from "next/router";
import {useUserContext} from "@/contexts/userContext";
import LoginDto from "@/dtos/requests/loginDto";
import api from "@/api";
import {AxiosResponse} from "axios";
import MemberDto from "@/dtos/responses/memberDto";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const userContext = useUserContext();

  const handleLogin = async (values: LoginDto) => {
    try {
      const response: AxiosResponse<MemberDto> = await api.post('account/login', values)

      try {
        const response: AxiosResponse<MemberDto> = await api.post('account/login', values)

        Cookies.set('user_id', response.data.id, {expires: 7});
        Cookies.set('user_name', response.data.name, {expires: 7});
        Cookies.set('user_role', response.data.role, {expires: 7});
        Cookies.set('access_token', response.data.token, {expires: 7});

        userContext.setUser(response.data);

        await router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      }

      userContext.setUser(response.data);

      await router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};
