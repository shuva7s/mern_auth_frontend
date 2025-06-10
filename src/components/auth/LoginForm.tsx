import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import ErrorBox from "../ui/error";
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});

const LoginForm = ({ afterLogin = "/" }: { afterLogin?: string }) => {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loadingState, setloadingState] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    try {
      setloadingState(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );
      form.reset();
      toast.success(res.data.message);
      await refetchUser();
      navigate(afterLogin, { replace: true });
    } catch (error: any) {
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setloadingState(false);
    }
  }
  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loadingState}
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-end flex-wrap">
                    Password
                    <a
                      href="/forgot-password"
                      className="text-xs hover:underline font-normal text-muted-foreground"
                    >
                      Forgot Password
                    </a>
                  </FormLabel>

                  <FormControl>
                    <div className="relative">
                      <Input
                        className="pr-10"
                        placeholder="Enter your password"
                        type={showPass ? "text" : "password"}
                        disabled={loadingState}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size={"icon"}
                        onClick={() => setShowPass(!showPass)}
                        className="absolute top-1/2 right-0 -translate-y-1/2"
                      >
                        {!showPass ? <Eye /> : <EyeClosed />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorBox error={error} />}

            <Button type="submit" disabled={loadingState} className="w-full">
              {loadingState ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-muted-foreground border-t text-xs gap-1 justify-center flex-wrap items-center py-4">
        <p>Don't have an account?</p>
        <Button disabled={loadingState} asChild variant="ghost" size={"xs"}>
          <a href="/register">Register</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
