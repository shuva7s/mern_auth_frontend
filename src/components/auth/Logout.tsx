import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Logout = ({
  afterLogout = "/login",
  variant = "default",
}: {
  afterLogout?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
}) => {
  const { refetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <Button
      disabled={loading}
      variant={variant}
      onClick={async () => {
        try {
          setLoading(true);
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}logout`,
            {},
            {
              withCredentials: true,
            }
          );
          setLoading(false);
          toast.success(res.data.message || "Login successful");
          await refetchUser();
          navigate(afterLogout, { replace: true });
        } catch (error: any) {
          toast.error(error.response.data.message || "Something went wrong");
        }
      }}
    >
      {loading ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
};

export default Logout;
