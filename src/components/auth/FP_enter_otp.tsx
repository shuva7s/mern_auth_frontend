import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useEffect, useState } from "react";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import ErrorBox from "../ui/error";

const otpSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const FP_enter_otp = ({
  setLevel,
}: {
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [loadingState, setloadingState] = useState(false);

  const [ttl, setTtl] = useState(0);
  const [cooldownError, setCooldownError] = useState("");
  const [cooldownLoading, setCooldownLoading] = useState(false);

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

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setError("");
    try {
      setloadingState(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}verify-fp-otp`,
        {
          otp: values.pin,
        },
        {
          withCredentials: true,
        }
      );
      otpform.reset();
      toast.success("Otp verified successfully");
      setLevel(3);
    } catch (error: any) {
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setloadingState(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter OTP</CardTitle>
        <CardDescription>Enter the otp sent to your email</CardDescription>
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
            <Loader2 className="size-3 animate-spin" />
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
                         `${import.meta.env.VITE_BACKEND_URL}resend-fp-otp`,
                          {},
                          {
                            withCredentials: true,
                          }
                        );
                        setTtl(res.data.ttl);
                        toast.success(res.data.message);
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

export default FP_enter_otp;
