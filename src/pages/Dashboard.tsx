import Logout from "@/components/auth/Logout";
import RevokeOtherSessions from "@/components/auth/RevokeOtherSessions";
import RevokeSession from "@/components/auth/RevokeSession";
import type { User } from "@/components/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
export type Session = {
  _id: string;
  user_agent: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
};
const DashboardPage = ({ user }: { user: User | null }) => {
  if (!user) return <Navigate to="/login" replace />;

  const [loadingSesssions, setSessionsLoading] = useState(false);
  const [sesssions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getSessions = async () => {
      setSessionsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}get-sessions`,
          {
            withCredentials: true,
          }
        );
        setSessions(res.data.sessions);
      } catch (error: any) {
        setError(error.response.data.message || "Something went wrong");
      } finally {
        setSessionsLoading(false);
      }
    };

    getSessions();
  }, []);
  return (
    <main className="wrapper">
      <section className="flex gap-4 flex-wrap">
        <div className="font-extrabold text-3xl size-15 flex justify-center items-center bg-accent rounded-full leading-0">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="h3">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </section>

      <section className="mt-4">
        {error ? (
          <div className="px-3 py-2 rounded-sm bg-destructive/10 text-destructive text-sm">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <h2 className="h4 mb-3">Sessions</h2>
            {loadingSesssions ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <>
                <div className="columns-1 md:columns-2 space-y-3 gap-3">
                  {sesssions.map((session: any) => (
                    <div
                      key={session._id}
                      className="p-4 border bg-card relative break-inside-avoid text-muted-foreground"
                    >
                      <p>
                        <span className="text-foreground">Session id: </span>
                        {session._id}
                      </p>
                      <p>
                        <span className="text-foreground">Ip: </span>
                        {session.ip_address}
                      </p>
                      <p>
                        <span className="text-foreground">User agent: </span>
                        {session.user_agent}
                      </p>
                      <p>
                        <span className="text-foreground">Session id: </span>
                        {session._id}
                      </p>
                      <p>
                        <span className="text-foreground">Expires at: </span>
                        {session.expires_at}
                      </p>
                      <p>
                        <span className="text-foreground">Created at: </span>
                        Created at: {session.created_at}
                      </p>
                      <p>
                        <span className="text-foreground">Updated at: </span>
                        {session.updated_at}
                      </p>
                      {session._id === user.session_id && (
                        <Badge className="absolute top-4 right-4 z-10">
                          Current
                        </Badge>
                      )}

                      <div className="mt-4 flex justify-end">
                        {session._id === user.session_id ? (
                          <Logout afterLogout="/" variant="secondary" />
                        ) : (
                          <RevokeSession
                            setSessions={setSessions}
                            session_id={session._id}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {sesssions.length > 1 && (
                  <div className="mt-10 flex justify-end">
                    <RevokeOtherSessions setSessions={setSessions} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default DashboardPage;
