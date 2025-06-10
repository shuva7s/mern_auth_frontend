import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const RateLimitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || "/";

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}get-user`, {
          withCredentials: true,
        });

        navigate(from, { replace: true });
      } catch (err: any) {
        console.warn("Rate limit hit:", err.response.data?.message);
      }
    };

    checkRateLimit();
  }, [navigate, from]);

  return (
    <main className="wrapper flex justify-center items-center flex-col gap-1">
      <h1 className="h1">Slow down there speedy</h1>
      <p className="h4 text-muted-foreground">
        You have reached the rate limit
      </p>
    </main>
  );
};

export default RateLimitPage;
