"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcherSwr";

type SubUserContextType = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;

  userImage: string | null;
  setUserImage: React.Dispatch<React.SetStateAction<string | null>>;
};

const SubUserContext = createContext<SubUserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {

  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState<string | null>(null);

  const shouldFetchUser = !username ;

  const { data } = useSWR(
    shouldFetchUser ? "/api/user" : null,
    fetcher
  );

  useEffect(() => {
    if (!data) return;

    setUsername(data.username ?? "");

    setUserImage(
      data.user_image
    );

  }, [data]);


  return (
    <SubUserContext.Provider
      value={{
        username,
        setUsername,
        userImage,
        setUserImage,
      }}
    >
      {children}
    </SubUserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(SubUserContext);

  if (!context) {
    throw new Error("useSubUser must be used within UserProvider");
  }

  return context;
}