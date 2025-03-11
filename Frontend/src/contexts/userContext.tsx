import React, { createContext, useContext, useEffect } from 'react';
import MemberDto from "@/dtos/responses/memberDto";
import Cookies from "js-cookie";

type UserContextType = {
  user: MemberDto | null;
  setUser: (user: MemberDto | null) => void;
  isAuthenticating: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
  const userContext: UserContextType | null = useContext(UserContext);
  if (!userContext) throw new Error('useUserContext must be used within a UserContextProvider');

  return userContext;
};

export default function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<MemberDto | null>(null);
  const [isAuthenticating, setIsAuthenticating] = React.useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userName = Cookies.get('user_name');
      const role = Cookies.get('user_role');
      const token = Cookies.get('access_token');
      const id = Cookies.get('user_id');

      if (userName && role && token && id) {
        setUser({
          id: id,
          name: userName,
          role: role,
          token: token
        });
      }
    }
    setIsAuthenticating(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticating }}>
      {children}
    </UserContext.Provider>);
}
