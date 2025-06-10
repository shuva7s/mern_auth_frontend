import { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Session } from "@/pages/Dashboard";

const RevokeOtherSessions = ({
  setSessions,
}: {
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}revoke-other-sessions`,
            {},
            {
              withCredentials: true,
            }
          );
          setSessions(res.data.sessions);
          toast.success(res.data.message);
        } catch (error: any) {
          toast.error(error.response.data.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loader2 className="animate-spin" /> : "Revoke other sessions"}
    </Button>
  );
};

export default RevokeOtherSessions;
