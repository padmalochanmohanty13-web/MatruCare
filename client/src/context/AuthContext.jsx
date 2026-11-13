
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/api/user/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signup = async (formData) => {
    const response = await api.post(
      "/api/auth/signup",
      formData
    );
    return response.data;
  };

  const verifyOtp = async (email, otp) => {
    const response = await api.post(
      "/api/auth/verify-otp",
      { email, otp }
    );
    return response.data;
  };

  const resendOtp = async (email) => {
    const response = await api.post(
      "/api/auth/resend-otp",
      { email }
    );
    return response.data;
  };

  const login = async (email, password) => {
    const response = await api.post(
      "/api/auth/login",
      { email, password }
    );

    const { token, user: loggedInUser } = response.data;

    localStorage.setItem("token", token);
    setUser(loggedInUser);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        verifyOtp,
        resendOtp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
