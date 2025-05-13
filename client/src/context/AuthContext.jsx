import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser } from "../utils/api";
import api from "../utils/axiosInstance"; // Make sure this is imported

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(); // should include cookies automatically
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("isLoggedIn");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem("isLoggedIn", "true");
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.get("/auth/logout"); // backend should clear the cookie
      localStorage.removeItem("isLoggedIn");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("isLoggedIn");
      setUser(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
