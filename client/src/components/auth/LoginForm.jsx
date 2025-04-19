"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { login } from "@/api/auth-api";

const greetings = [
  "Nice to see you again!",
  "Welcome back!",
  "Hope you're having a great day!",
  "Let's get started!",
  "Good to see you!",
  "Ready to conquer the day?"
];

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email")
    .trim(),
  password: z
    .string({ required_error: "Password must have at least 8 characters" })
    .min(8, "Password must have at least 8 characters")
    .trim()
});

export default function LoginForm() {
  const [randomGreeting, setRandomGreeting] = useState(" ");

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

  const onSubmit = async (formData) => {
    try {
      const data = await login({ ...formData, remember });

      if (!data.user) {
        toast.error("Login failed! Try 'Forgot password?' ");
      } else {
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <p className="font-bold text-black text-2xl whitespace-pre mb-8">{randomGreeting}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mb-8" autoComplete="off">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative pb-5">
                <FormLabel className="text-gray-800 text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 text-foreground rounded-sm bg-gray-200"
                  />
                </FormControl>
                <FormMessage className="text-xs absolute left-0 bottom-0" />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative pb-5">
                <FormLabel className="text-gray-800 text-xs">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full h-12 text-foreground rounded-sm bg-gray-200"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage className="text-xs absolute left-0 bottom-0" />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center mb-2">
            <div className="flex pb-2">
              <Switch
                id="remember"
                name="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked)}
              />
              <Label htmlFor="remember" className="ml-2 block text-sm text-gray-90">
                Remember me
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-blue-green hover:text-prussian-blue"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-blue-green text-ghost-white text-md hover:bg-prussian-blue"
          >
            Login
          </Button>
        </form>
      </Form>
      <div className="border-t border-gray-300 mb-6"></div>
      <p className=" text-center">
        Don't have an account?{" "}
        <Link href="/auth/register" className="ml-2 text-blue-green hover:text-prussian-blue">
          Sign up now
        </Link>
      </p>
    </>
  );
}
