import React, { use, useEffect, useState } from "react";
import api from "@/api";
import { AxiosResponse } from "axios";
import UserDto from "@/dtos/responses/userDto";
import TimeAgo from "react-timeago";
import { useUserContext } from "@/contexts/userContext";

export default function Index() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const {user} = useUserContext();

  useEffect(() => {
    api.get('/user').then((response: AxiosResponse<UserDto[]>) => {
      setUsers(response.data);
    })
    .catch(error => console.error(error));
  }, [user]);

  const updateToAdmin = (id: string) => {
    api.put(`/user/${id}/role`)
    .then(() => {
      setUsers(users.map(user => user.id === id ? { ...user, role: 'Admin' } : user));
    })
    .catch(error => console.error(error));
  }

  return (
    <div className="container mt-4">
      <h1>User List</h1>
      <table className="table">
        <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Last Active</th>
          { user && user.role === 'Admin' &&
            <th>Actions</th> }
        </tr>
        </thead>
        <tbody>
        {users.map((userDto) => (
          <tr key={userDto.id}>
            <td>{userDto.username}</td>
            <td>{userDto.role}</td>
            <td>
              <TimeAgo date={userDto.lastActive} />
            </td>
            { user && user.role === 'Admin' && user.id !== userDto.id && userDto.role !== 'Admin' &&
              <td>
                <button className="btn btn-warning" onClick={_ => updateToAdmin(userDto.id)}>Update to admin</button>
              </td>
             }
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
