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
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ErrorBox from "../ui/error";

const formSchema = z.object({
  email: z.string().email("Invalid email address format"),
});

const FP_enter_email = ({
  setLevel,
}: {
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [error, setError] = useState("");
  const [loadingState, setloadingState] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    try {
      setloadingState(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}get-fp-otp`,
        {
          email: values.email,
        },
        {
          withCredentials: true,
        }
      );
      form.reset();
      toast.success(res.data.message || "OTP has been sent to your email");
      setLevel(2);
    } catch (error: any) {
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setloadingState(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter email</CardTitle>
        <CardDescription>Enter your email to receive the otp</CardDescription>
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
                      type="email"
                      placeholder="Enter email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorBox error={error} />}
            <Button disabled={loadingState} className="w-full" type="submit">
              {loadingState ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FP_enter_email;
