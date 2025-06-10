import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegistrationPage from "./pages/Registration";
import NotFoundPage from "./pages/NotFound";
import HomePage from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import { useAuth } from "./components/hooks/useAuth";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import RateLimitPage from "./pages/Ratelimit";
import ForgotPassword from "./pages/ForgotPassword";
function App() {
  const { user, loading, rateLimited } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (rateLimited) {
      navigate("/rate-limit");
    }
  }, [rateLimited, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {loading ? (
        <main className="wrapper py-5 min-h-screen flex items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </main>
      ) : (
        <>
          <header className="wrapper py-5">
            <p className="h4">Navbar</p>
          </header>

          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={<LoginPage user={user} />} />
            <Route
              path="/register"
              element={<RegistrationPage user={user} />}
            />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/rate-limit" element={<RateLimitPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <footer className="wrapper py-5">
            <p>Footer</p>
          </footer>
        </>
      )}
      <Toaster theme="system" richColors={true} closeButton={true} />
    </div>
  );
}

export default App;
