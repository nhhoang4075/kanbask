"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Dot } from "lucide-react";

import Spinner from "@/components/app/spinner";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendVerificationCode, verifyEmail } from "@/actions/auth-actions";
import { useSession } from "@/hooks/use-session";

const greetings = [
  "Let's verify your email!",
  "Almost there, just one step!",
  "Security is our priority",
  "Thanks for verifying your email",
  "Complete your account setup",
  "Verify your identity",
  "Keep your account secure",
  "Thanks for helping us stay secure"
];

const VerifySchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must be numeric")
});

export default function VerifyEmailForm() {
  const [randomGreeting, setRandomGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { user, loading, logout } = useSession();

  useEffect(() => {
    // Set random greeting on client side only
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setRandomGreeting(greetings[randomIndex]);

    // Load cooldown from localStorage
    const storedCooldown = localStorage.getItem("verify-email-cooldown");
    if (storedCooldown) {
      const expiryTime = parseInt(storedCooldown, 10);
      const now = Date.now();
      if (expiryTime > now) {
        setCooldown(Math.ceil((expiryTime - now) / 1000));
      } else {
        localStorage.removeItem("verify-email-cooldown");
      }
    }
  }, []);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          const newValue = prev - 1;
          if (newValue === 0) {
            localStorage.removeItem("verify-email-cooldown");
          }
          return newValue;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const form = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: ""
    }
  });

  const onSendCode = async () => {
    if (cooldown > 0) return;

    setIsLoading(true);
    try {
      await sendVerificationCode();
      toast.success("Verification code has been sent to your email!");
      const expiryTime = Date.now() + 30 * 1000; // 30 seconds cooldown
      localStorage.setItem("verify-email-cooldown", expiryTime.toString());
      setCooldown(30);
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await verifyEmail(formData.code);
      toast.success("Email verified! Please login again to continue.");
      await logout();
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" />;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-prussian-blue mb-2">Verify Email</h2>
        <p className="text-gray-600 min-h-6 whitespace-pre">{randomGreeting}</p>
      </div>

      <div className="flex flex-col items-center bg-prussian-blue/5 rounded-lg p-4 pb-2">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            A verification code will be sent to{" "}
            <span className="font-semibold text-prussian-blue">{user?.email}</span>
          </p>
          <p className="text-sm text-gray-600">
            Please check your email inbox and enter the OTP below. The code will expire after 30
            minutes.
          </p>
          <p className="text-sm text-gray-600">
            If you don't see it, you might need to{" "}
            <span className="font-semibold text-prussian-blue">check your spam folder</span>.
          </p>
        </div>

        <Button
          type="button"
          variant="link"
          onClick={onSendCode}
          className="text-md text-blue-green"
          disabled={isLoading || cooldown > 0}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          spellCheck="false"
          className="space-y-2"
        >
          <div className="flex flex-col items-center">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem {...field} className="relative w-full py-8">
                  <FormControl>
                    <InputOTP maxLength={6} containerClassName="justify-center">
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="h-16 w-12 text-lg text-prussian-blue border-prussian-blue/20"
                        />
                        <InputOTPSlot
                          index={1}
                          className="h-16 w-12 text-lg text-prussian-blue border-prussian-blue/20"
                        />
                        <InputOTPSlot
                          index={2}
                          className="h-16 w-12 text-lg text-prussian-blue border-prussian-blue/20"
                        />
                      </InputOTPGroup>
                      <Dot />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className="h-16 w-12 text-lg text-prussian-blue border-prussian-blue/20"
                        />
                        <InputOTPSlot
                          index={4}
                          className="h-16 w-12 text-lg text-prussian-blue border-prussian-blue/20"
                        />
                        <InputOTPSlot
                          index={5}
                          className="h-16 w-12 text-lg text-prussian-blue border-prussian-blue/20"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-blue-green hover:bg-prussian-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
