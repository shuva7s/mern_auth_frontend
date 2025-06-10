import { Button } from "../ui/button";

const Login = ({ loginRoute = "/login" }: { loginRoute?: string }) => {
  return (
    <Button asChild>
      <a href={loginRoute}>Login</a>
    </Button>
  );
};

export default Login;
