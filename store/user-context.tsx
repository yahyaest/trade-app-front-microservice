import { createContext, useState, useEffect } from "react";
// import { getSession } from "next-auth/client";
import Cookies from "js-cookie";
import { getCurrentUser } from "../services/gateway";


const UserContext = createContext({
  token: null,
  user: null,
  // session: null,
  login: function (user: { email: string; password: string }) {},
  logout: function () {},
});

export function UserContextProvider(props: any) {
  const [currentUser, setCurrentUser] = useState<any>();
  const [currentToken, setCurrentToken] = useState<string | null>();
  // const [currentSession, setCurrentSession] = useState();

  useEffect(() => {
    async function fetchData() {
        const token = Cookies.get("token");
        if (token) {
          setCurrentToken(token);
          const user = await getCurrentUser();
          setCurrentUser(user);
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

  const context = {
    user: currentUser,
    // session: currentSession,
  };

  return (
    <UserContext.Provider value={context as any}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
