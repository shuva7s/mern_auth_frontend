import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";
import type { User } from "@/components/hooks/useAuth";
import Cookies from "js-cookie";

import RegistrationForm from "@/components/auth/RegistrationForm";
import OtpVerification from "@/components/auth/RegistrationVerification";

const RegistrationPage = ({ user }: { user: User | null }) => {
  if (user) return <Navigate to="/" replace />;

  const [hasotp, setHasotp] = useState(false);
  const [ttl, setTtl] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (ttl > 0) {
      interval = setInterval(() => {
        setTtl((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [ttl]);

  useEffect(() => {
    const sessionToken = Cookies.get("registration_token");
    if (sessionToken) {
      setHasotp(true);
    } else {
      setHasotp(false);
    }
  }, [hasotp]);

  return (
    <main className="wrapper flex items-center justify-center">
      {hasotp ? (
        <OtpVerification ttl={ttl} setTtl={setTtl} />
      ) : (
        <RegistrationForm setHasotp={setHasotp} setTtl={setTtl} />
      )}
    </main>
  );
};

export default RegistrationPage;
