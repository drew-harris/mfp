import { createContext, type ReactNode, useState } from "react";

import { useMutation } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import { useNotifications } from "../../stores/notifications";

const LOG_IN = gql(/* GraphQL */ `
  mutation LogIn($username: String!) {
    loginOrCreate(playerName: $username) {
      id
      name
    }
  }
`);

type User = {
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
  const [user, _setUser] = useState<User | null>(null);
  const sendError = useNotifications((s) => s.sendError);

  const [logInMutation, { loading }] = useMutation(LOG_IN, {
    onCompleted(data) {
      _setUser({ id: data.loginOrCreate.id, name: data.loginOrCreate.name });
    },
    onError(error, clientOptions) {
      console.error("ERROR LOGGING IN", error, clientOptions);
      sendError(error.message);
    },
  });

  const logIn = (username: string) => {
    console.log("LOGGING IN", username);
    logInMutation({
      variables: {
        username: username,
      },
    });
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
