"use client";

import {useUserContext} from "@/contexts/userContext";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import api from "@/api";
import {AxiosResponse} from "axios";
import UserDto from "@/dtos/responses/userDto";
import MemberDto from "@/dtos/responses/memberDto";

export default function Manage() {
  const userContext = useUserContext();
  const router = useRouter();
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (!userContext.isAuthenticating && !userContext.user) {
      router.push('/account/login');
    }
  }, [userContext.user, userContext.isAuthenticating, router]);

  const changeUsername = (newUsername: string) => {
    api.put('user/username', {newUsername})
      .then((response: AxiosResponse<MemberDto>) => {
        localStorage.setItem('user_id', response.data.id);
        localStorage.setItem('user_name', response.data.name);
        localStorage.setItem('user_role', response.data.role);
        localStorage.setItem('access_token', response.data.token);

        userContext.setUser(response.data);
      })
  }

  const deleteAccount = () => {
    api.delete('user')
      .then(() => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('access_token');

        userContext.setUser(null);
        router.push('/');
      })
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 shadow-lg rounded-lg" style={{width: '400px'}}>
        <h1 className="text-center mb-4">Manage Account</h1>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input className="form-control" type="text" id="username" value={userContext.user?.name} readOnly />
        </div>
        <div className="mb-3">
          <label htmlFor="newUsername" className="form-label">New username</label>
          <input className="form-control" type="text" id="newUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={() => changeUsername(newUsername)}>Change username</button>
          <button className="btn btn-danger" onClick={deleteAccount}>Delete account</button>
        </div>
      </div>
    </div>
  );
}