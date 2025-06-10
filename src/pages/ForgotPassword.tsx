import FP_enter_email from "@/components/auth/FP_enter_email";
import FP_enter_otp from "@/components/auth/FP_enter_otp";
import FP_reset_pass from "@/components/auth/FP_reset_pass";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const ForgotPassword = () => {
  const [level, setLevel] = useState(1);
  useEffect(() => {
    const fp_otp = Cookies.get("fp_otp");
    const fp_reset = Cookies.get("fp_reset");
    if (fp_otp) {
      setLevel(2);
    }
    if (fp_reset) {
      setLevel(3);
    }
  }, [level]);

  return (
    <main className="wrapper flex items-center justify-center flex-col gap-6">
      {level === 1 && <FP_enter_email setLevel={setLevel} />}
      {level === 2 && <FP_enter_otp setLevel={setLevel} />}
      {level === 3 && <FP_reset_pass />}
    </main>
  );
};

export default ForgotPassword;
