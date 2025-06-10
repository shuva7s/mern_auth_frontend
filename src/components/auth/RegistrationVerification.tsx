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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import ErrorBox from "../ui/error";

const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OtpVerification = ({
  ttl,
  setTtl,
}: {
  ttl: number;
  setTtl: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loadingState, setloadingState] = useState(false);
  const navigate = useNavigate();
  const [cooldownError, setCooldownError] = useState("");
  const [cooldownLoading, setCooldownLoading] = useState(false);
  const { refetchUser } = useAuth();

  const otpform = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    const fetchCooldown = async () => {
      setCooldownLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}get-cooldown-time`,
          {
            withCredentials: true,
          }
        );
        if (res.data.ttl) {
          setTtl(res.data.ttl);
        }
      } catch (error: any) {
        setCooldownError(error.response.data.message || "Something went wrong");
      } finally {
        setCooldownLoading(false);
      }
    };

    fetchCooldown();
  }, []);

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setError("");
    try {
      setloadingState(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}verify-registration`,
        {
          otp: values.pin,
        },
        {
          withCredentials: true,
        }
      );
      otpform.reset();
      toast.success(res.data.message);
      await refetchUser();
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
        <CardTitle>Enter otp</CardTitle>
        <CardDescription>Verify your email address to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...otpform}>
          <form
            onSubmit={otpform.handleSubmit(onOtpSubmit)}
            className="space-y-6"
          >
            <FormField
              control={otpform.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between flex-wrap items-center">
                    One-Time Password
                    <Button
                      variant="secondary"
                      type="button"
                      size="sm_icon"
                      onClick={() => setShowOtp(!showOtp)}
                    >
                      {showOtp ? <EyeClosed /> : <Eye />}
                    </Button>
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setError("");
                      }}
                      disabled={loadingState}
                    >
                      <InputOTPGroup className="w-full flex flex-wrap">
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            className="flex-1"
                            index={index}
                            showOtp={showOtp}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the otp sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <ErrorBox error={error} />}

            <Button disabled={loadingState} type="submit" className="w-full">
              {loadingState ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit OTP"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {!cooldownError && (
        <CardFooter className="text-xs text-muted-foreground gap-1 justify-center flex-wrap">
          {cooldownLoading ? (
            <Loader2 className="animate-spin size-3" />
          ) : (
            <>
              {ttl > 0 ? (
                <p>Resend otp after {ttl} seconds</p>
              ) : (
                <>
                  <p>Didn't receive the otp?</p>
                  <Button
                    disabled={loadingState || ttl > 0}
                    onClick={async () => {
                      setCooldownLoading(true);
                      try {
                        const res = await axios.post(
                          `${import.meta.env.VITE_BACKEND_URL}resend-otp`,
                          {},
                          {
                            withCredentials: true,
                          }
                        );
                        setTtl(res.data.ttl);
                      } catch (error: any) {
                        setError(
                          error.response.data.message || "Something went wrong"
                        );
                      } finally {
                        setCooldownLoading(false);
                      }
                    }}
                    variant={"ghost"}
                    size={"xs"}
                  >
                    Resend
                  </Button>
                </>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default OtpVerification;
