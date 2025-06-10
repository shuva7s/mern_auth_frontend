import { Navigate } from "react-router-dom";
import type { User } from "@/components/hooks/useAuth";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = ({ user }: { user: User | null }) => {
  if (user) return <Navigate to="/" replace />;

  return (
    <main className="wrapper flex items-center justify-center">
      <LoginForm afterLogin="/" />
    </main>
  );
};

export default LoginPage;
