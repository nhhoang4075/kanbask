"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { validate as uuidValidate } from "uuid";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { forgotPassword, resetPassword } from "@/actions/auth-actions";

const greetings = [
  "No worries, we'll help you!",
  "Let's recover your account",
  "We'll get you back in",
  "Password recovery in progress",
  "We've got you covered",
  "Just a few steps away",
  "Almost there!",
  "Security is our priority"
];

const EmailSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .max(100, "Email must be less than 100 characters")
    .email("Invalid email")
    .trim()
});

const PasswordResetSchema = z
  .object({
    new_password: z
      .string({ required_error: "Password must have at least 8 characters" })
      .min(8, "Password must have at least 8 characters")
      .trim(),
    confirm_password: z.string().min(1, "Confirm password is required")
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"]
  });

export default function ForgotPasswordForm() {
  const [randomGreeting, setRandomGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  // Check if code is valid UUID and redirect if not
  useEffect(() => {
    if (code && !uuidValidate(code)) {
      router.push("/auth/forgot-password");
    }
  }, [code, router]);

  useEffect(() => {
    // Set random greeting on client side only
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setRandomGreeting(greetings[randomIndex]);

    // Load cooldown from localStorage
    const storedCooldown = localStorage.getItem("forgot-password-cooldown");
    if (storedCooldown) {
      const expiryTime = parseInt(storedCooldown, 10);
      const now = Date.now();
      if (expiryTime > now) {
        setCooldown(Math.ceil((expiryTime - now) / 1000));
      } else {
        localStorage.removeItem("forgot-password-cooldown");
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
            localStorage.removeItem("forgot-password-cooldown");
          }
          return newValue;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const emailForm = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: ""
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      new_password: "",
      confirm_password: ""
    }
  });

  const onEmailSubmit = async (formData) => {
    if (cooldown > 0) return;

    setIsLoading(true);
    try {
      await forgotPassword(formData.email);
      toast.success("Password reset link has been sent to your email!");
      const expiryTime = Date.now() + 30 * 1000; // 30 seconds from now
      localStorage.setItem("forgot-password-cooldown", expiryTime.toString());
      setCooldown(30);
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await resetPassword({
        code: code,
        new_password: formData.new_password
      });
      toast.success("Password has been reset successfully!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If code exists but is invalid, render nothing while redirecting
  if (code && !uuidValidate(code)) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-prussian-blue mb-2">
          {code ? "Reset Password" : "Forgot Password"}
        </h2>
        <p className="text-gray-600 min-h-6 whitespace-pre">{randomGreeting}</p>
      </div>

      {!code ? (
        <div className="space-y-8">
          <div className="flex flex-col items-center bg-prussian-blue/5 rounded-lg p-4 pb-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                A confirmation will be sent to your email. Please check your email inbox to reset
                your password.
              </p>
              <p className="text-sm text-gray-600">
                If you don't see it, you might need to{" "}
                <span className="font-semibold text-prussian-blue">check your spam folder</span>.
              </p>
            </div>
          </div>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="space-y-2"
              autoComplete="off"
              spellCheck="false"
            >
              <FormField
                name="email"
                control={emailForm.control}
                render={({ field }) => (
                  <FormItem className="relative pb-5">
                    <FormLabel className="text-xs !text-black">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-blue-green focus-visible:ring-0 transition-colors duration-200"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                      />
                    </FormControl>
                    <FormMessage className="absolute left-0 bottom-0 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 bg-blue-green hover:bg-prussian-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || cooldown > 0}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Send"}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-2"
            autoComplete="off"
            spellCheck="false"
          >
            <FormField
              name="new_password"
              control={passwordForm.control}
              render={({ field }) => (
                <FormItem className="relative pb-5">
                  <FormLabel className="text-xs !text-black">New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                      className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-blue-green focus-visible:ring-0 transition-colors duration-200"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage className="absolute left-0 bottom-0 text-xs" />
                </FormItem>
              )}
            />
            <FormField
              name="confirm_password"
              control={passwordForm.control}
              render={({ field }) => (
                <FormItem className="relative pb-5">
                  <FormLabel className="text-xs !text-black">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm new password"
                      className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-blue-green focus-visible:ring-0 transition-colors duration-200"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage className="absolute left-0 bottom-0 text-xs" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-blue-green hover:bg-prussian-blue transition-colors duration-200"
              disabled={isLoading}
            >
              Reset Password
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="flex-1 h-px bg-prussian-blue/30"></div>
          <span className="text-gray-500 text-sm px-2">or</span>
          <div className="flex-1 h-px bg-prussian-blue/30"></div>
        </div>
        <p className="text-gray-600">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-blue-green font-medium hover:text-prussian-blue transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
