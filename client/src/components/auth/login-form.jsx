"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { login } from "@/actions/auth-actions";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const greetings = [
  "Welcome back, we've missed you!",
  "Great to see you again!",
  "Ready for another productive day?",
  "Your journey continues here!",
  "Back in your digital space!",
  "Let's make today count!",
  "Back for more amazing things!",
  "Your success story continues!"
];

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .max(100, "Email must be less than 100 characters")
    .email("Invalid email")
    .trim(),
  password: z
    .string({ required_error: "Password must have at least 8 characters" })
    .min(8, "Password must have at least 8 characters")
    .max(255, "Password must be less than 255 characters")
    .trim()
});

export default function LoginForm() {
  const [randomGreeting, setRandomGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setRandomGreeting(greetings[randomIndex]);
  }, []);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const [remember, setRemember] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || DEFAULT_LOGIN_REDIRECT;

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const data = await login({ ...formData, remember });

      if (!data?.user) {
        toast.error("Invalid credentials. Please try again.");
        return;
      }

      toast.success("Login successful!");
      router.push(redirectUrl);
    } catch (error) {
      const errorMessage = error.message || "An error occurred during login. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-prussian-blue mb-2">Sign in</h2>
        <p className="text-gray-600">{randomGreeting}</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
          autoComplete="off"
          spellCheck="false"
        >
          <FormField
            name="email"
            control={form.control}
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
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative pb-5">
                <FormLabel className="text-xs !text-black">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-blue-green focus-visible:ring-0 transition-colors duration-200"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage className="absolute left-0 bottom-0 text-xs" />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="remember"
                checked={remember}
                onCheckedChange={setRemember}
                className="data-[state=checked]:bg-blue-green"
              />
              <Label htmlFor="remember" className="text-gray-700 text-sm">
                Remember me
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-green hover:text-prussian-blue transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-green hover:bg-prussian-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="flex-1 h-px bg-prussian-blue/30"></div>
          <span className="text-gray-500 text-sm px-2">or</span>
          <div className="flex-1 h-px bg-prussian-blue/30"></div>
        </div>
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-green font-medium hover:text-prussian-blue transition-colors duration-200"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
