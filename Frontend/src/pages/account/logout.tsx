import {useEffect} from "react";
import {useUserContext} from "@/contexts/userContext";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Logout() {
  const userContext = useUserContext();
  const router = useRouter();


  useEffect(() => {
    Cookies.remove('user_id');
    Cookies.remove('user_name');
    Cookies.remove('user_role');
    Cookies.remove('access_token');
    userContext.setUser(null);
    router.push('/');
  }, [router, userContext]);


  return <div>Logged out</div>;
}