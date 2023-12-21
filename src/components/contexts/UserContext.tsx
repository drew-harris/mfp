import { createContext, type ReactNode, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import { useNotifications } from "../../stores/notifications";
import { client } from "../../api/client";

const LOG_IN = gql(`
query getPlayerByCode($code: ID!) {
  player(id: $code) {
    id
    name
  }
}
`);

export type User = {
  id: string;
  name: string;
};

interface UserContextProviderValue {
  user: User | null;
  loading: boolean;
  logIn: (username: string) => void;
  logOut: () => void;
}

const defaults: UserContextProviderValue = {
  user: null,
  loading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logIn: (_username: string) => {
    console.log("Got default");
  },
  logOut() {
    console.log("Got Default");
  },
};

export const UserContext = createContext<UserContextProviderValue>(defaults);

export default function UserProvider({ children }: { children: ReactNode }) {
  const getInitialUser = () => {
    const user = window.localStorage.getItem("userblob");
    if (user) {
      return JSON.parse(user) as User;
    } else {
      return null;
    }
  };
  const [user, _setUser] = useState<User | null>(getInitialUser);
  const [loading, setLoading] = useState(false);
  const sendError = useNotifications((s) => s.sendError);

  const saveUser = (user: User) => {
    window.localStorage.setItem("userblob", JSON.stringify(user));
  };

  const logIn = async (code: string) => {
    try {
      setLoading(true);
      const result = await client.query({
        query: LOG_IN,
        variables: {
          code: code,
        },
      });

      _setUser(result.data.player);
      saveUser(result.data.player);
      setLoading(false);
    } catch {
      alert("error signing in");
    }
  };

  const logOut = () => {
    _setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ loading, user: user as User | null, logIn: logIn, logOut }}
    >
      {children}
    </UserContext.Provider>
  );
}
