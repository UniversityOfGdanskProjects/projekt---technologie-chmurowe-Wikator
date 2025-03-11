import React from 'react';
import {useRouter} from "next/router";
import {useUserContext} from "@/contexts/userContext";
import RegisterForm from '@/app/forms/RegisterForm';
import RegisterDto from "@/dtos/requests/registerDto";
import {AxiosResponse} from "axios";
import MemberDto from "@/dtos/responses/memberDto";
import api from "@/api";
import Cookies from "js-cookie";

export default function Register() {
  const router = useRouter();
  const userContext = useUserContext();

  const handleRegister = async (values: RegisterDto) => {
    try {
      const response: AxiosResponse<MemberDto> = await api.post('account/register', values);

      Cookies.set('user_id', response.data.id);
      Cookies.set('user_name', response.data.name);
      Cookies.set('user_role', response.data.role);
      Cookies.set('access_token', response.data.token);


      userContext.setUser(response.data);
      await router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
};
