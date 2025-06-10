import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";
import ErrorBox from "../ui/error";

const formSchema = z
  .object({
    pass: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmPass: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
  })
  .refine((data) => data.pass === data.confirmPass, {
    message: "Passwords don't match",
    path: ["confirmPass"],
  });

const FP_reset_pass = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [loadingState, setloadingState] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pass: "",
      confirmPass: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    try {
      setloadingState(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}reset-password`,
        {
          password: values.pass,
          confirm_password: values.confirmPass,
        },
        {
          withCredentials: true,
        }
      );
      form.reset();
      toast.success("Password reset successfully");
      navigate("/", { replace: true });
    } catch (error: any) {
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setloadingState(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        variant="secondary"
                        onClick={() => setShowPass((prev) => !prev)}
                      >
                        {showPass ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        variant="secondary"
                        onClick={() => setShowConfirmPass((prev) => !prev)}
                      >
                        {showConfirmPass ? <EyeClosed /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorBox error={error} />}
            <Button className="w-full" type="submit" disabled={loadingState}>
              {loadingState ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FP_reset_pass;
