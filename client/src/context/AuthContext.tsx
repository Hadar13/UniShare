import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import api from '../services/api';

type User = {
  _id: string;
  name: string;
  email?: string;
  university?: string;
  major?: string;
  role?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (newToken: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');

        const currentUser = response.data.data || response.data.user;
        setUser(currentUser);
        setToken(storedToken);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, logout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}