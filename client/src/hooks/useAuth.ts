import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // support both `{ accessToken, user }` and legacy `{ token, user }`
        const user = parsed.user ?? parsed;
        const token = parsed.accessToken ?? parsed.token ?? "";
        setUser(user);
        setToken(token);
      } catch (e) {
        console.error("Failed to parse auth:", e);
      } finally {
        setInitialized(true);
      }
    } else {
      setInitialized(true);
    }
  }, []);

  const login = (data: any) => {
    setUser(data.user);
    setToken(data.accessToken);
    localStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("auth");
  };

  return { user, token, login, logout, initialized };
}
