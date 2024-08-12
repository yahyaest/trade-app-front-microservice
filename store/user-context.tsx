import { createContext, useState, useEffect } from "react";
// import { getSession } from "next-auth/client";
import Cookies from "js-cookie";
import GatewayClient from "@/services/gateway";
import { User } from "@/models/user";

const UserContext = createContext({
  token: null,
  user: null as User | null,
  avatar: null as string | null | any,
  // session: null,
  login: function (user: { email: string; password: string }) {},
  logout: function () {},
});

export function UserContextProvider(props: any) {
  const gatewayClient = new GatewayClient();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [currentAvatar, setCurrentAvatar] = useState<string>();
  const [currentToken, setCurrentToken] = useState<string | null>();
  // const [currentSession, setCurrentSession] = useState();

  useEffect(() => {
    async function fetchData() {
      const token = Cookies.get("token");
      if (token) {
        setCurrentToken(token);
        const user = await gatewayClient.getCurrentUser();
        const avatar = await gatewayClient.getCurrentUserAvatar();
        setCurrentUser(user);
        if (avatar) setCurrentAvatar(avatar);
      }
      // const session = await getSession();
      // if (session) {
      //   let user = await axios.get("/api/users/me");
      //   user = user.data;
      //   setCurrentSession(session);
      //   setCurrentUser(user);
      // }
    }
    fetchData();
  }, []);

  const logoutHandler = async () => {
    await gatewayClient.logout();
    setCurrentToken(null);
    setCurrentUser(null);
  };

  const context = {
    user: currentUser,
    avatar: currentAvatar,
    logout: logoutHandler,
  };

  return (
    <UserContext.Provider value={context as any}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
