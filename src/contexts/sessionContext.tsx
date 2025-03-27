"use client";

import { createContext, useContext, useState } from "react";

interface SessionContextProps {
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export function SessionProvider({
  children,
  initialSessionToken,
}: {
  children: React.ReactNode;
  initialSessionToken?: string | null;
}) {
  const [sessionToken, setSessionToken] = useState<string | null>(
    initialSessionToken || null
  );

  return (
    <SessionContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession phải được dùng trong SessionProvider");
  }
  return context;
}
