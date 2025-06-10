import Login from "@/components/auth/Login";
import Logout from "@/components/auth/Logout";
import { type User } from "@/components/hooks/useAuth";
import { Button } from "@/components/ui/button";
const HomePage = ({ user }: { user: User | null }) => {
  return (
    <main className="wrapper flex justify-center items-center">
      <section className="flex flex-col items-center gap-3">
        {user ? (
          <>
            <h1 className="h3">Welcome back, {user.name}!</h1>
            <div className="space-x-2">
              <Logout variant="secondary" afterLogout="/login" />
              <Button asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="h3">Please login or register</h1>
            <Login loginRoute="/login" />
          </>
        )}
      </section>
    </main>
  );
};

export default HomePage;
