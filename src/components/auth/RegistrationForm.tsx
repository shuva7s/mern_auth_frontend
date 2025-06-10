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
import { toast } from "sonner";
import ErrorBox from "../ui/error";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().email("Invalid email address format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});

const RegistrationForm = ({
  setHasotp,
  setTtl,
}: {
  setHasotp: React.Dispatch<React.SetStateAction<boolean>>;
  setTtl: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loadingState, setloadingState] = useState(false);

  const registrationForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    try {
      setloadingState(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );
      setTtl(res.data.ttl || 20);
      registrationForm.reset();
      setHasotp(true);
      toast.success(res.data.message);
    } catch (error: any) {
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setloadingState(false);
    }
  }

  return (
    <Card className="pb-0">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your name, email and password to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...registrationForm}>
          <form
            onSubmit={registrationForm.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={registrationForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loadingState}
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
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
              control={registrationForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

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
                        className="absolute top-1/2 right-1 -translate-y-1/2"
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
              {loadingState ? <Loader2 className="animate-spin" /> : "Register"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-muted-foreground border-t text-xs gap-1 justify-center flex-wrap items-center py-4">
        <p>Already have an account?</p>
        <Button disabled={loadingState} asChild variant="ghost" size={"xs"}>
          <a href="/login">Login</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RegistrationForm;
