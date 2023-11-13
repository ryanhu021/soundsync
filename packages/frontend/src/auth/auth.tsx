import React, { useEffect, useState, createContext, useContext } from "react";

export type AuthContext = {
  name: string;
  email: string;
};

export const AuthContext = createContext<AuthContext>({
  name: "",
  email: "",
});

export const AuthProvider: React.FunctionComponent<React.PropsWithChildren> = ({
  children,
}): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
      })
      .catch((err) => console.log(err));
  }, []);

  const contextValue = {
    name,
    email,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext => useContext(AuthContext);
