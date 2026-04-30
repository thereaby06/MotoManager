import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("mm_token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("mm_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [workshop, setWorkshop] = useState(() => {
    const raw = localStorage.getItem("mm_workshop");
    return raw ? JSON.parse(raw) : null;
  });

  const login = ({ token: newToken, user: newUser, workshop: newWorkshop }) => {
    setToken(newToken);
    setUser(newUser);
    setWorkshop(newWorkshop);
    localStorage.setItem("mm_token", newToken);
    localStorage.setItem("mm_user", JSON.stringify(newUser));
    localStorage.setItem("mm_workshop", JSON.stringify(newWorkshop));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setWorkshop(null);
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
    localStorage.removeItem("mm_workshop");
  };

  const value = useMemo(
    () => ({ token, user, workshop, workshopId: workshop?.id, login, logout }),
    [token, user, workshop]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
