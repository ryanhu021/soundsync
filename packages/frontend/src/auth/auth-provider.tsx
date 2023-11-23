import React, { useEffect, useState, createContext, useContext } from "react";

type UserContext = {
  name: string;
  email: string;
};

export type AuthContext = {
  user: UserContext;
  loading: boolean;
};

export const AuthContext = createContext<AuthContext>({
  user: {
    name: "",
    email: "",
  },
  loading: true,
});

export const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/check-auth`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 200) {
          const json = await res.json();
          setName(json.user.name);
          setEmail(json.user.email);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const contextValue = {
    user: {
      name,
      email,
    },
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext => useContext(AuthContext);
