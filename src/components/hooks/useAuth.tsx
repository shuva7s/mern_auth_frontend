// // hooks/useAuth.tsx
// import { useEffect, useState } from "react";
// import axios from "axios";

// export interface User {
//   name: string;
//   user_id: string;
//   email: string;
//   session_id: string;
//   user_agent: string;
// }

// export const useAuth = () => {
//   const [user, setUser] = useState<null | User>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/auth/get-user", {
//           withCredentials: true,
//         });
//         setUser(res.data.user);
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return { user, loading };
// };

// hooks/useAuth.tsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// 👤 Define user type
export interface User {
  name: string;
  user_id: string;
  email: string;
  session_id: string;
  user_agent: string;
}

// 🔁 Define context shape
interface AuthContextType {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
  rateLimited: boolean;
}

// 🧱 Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧠 Custom hook to consume context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// 📦 AuthProvider component to wrap the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}get-user`,
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
      setRateLimited(false);
    } catch (err: any) {
      if (err.response?.status === 429) {
        console.warn("Rate limit hit:", err.response.data?.message);
        setRateLimited(true);
        toast.error("You're making too many requests.");
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refetchUser: fetchUser,
        rateLimited,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
