"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLock, FiUser} from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label} from "@/components/ui/label";
import { validateUser } from "@/lib/UserActions";

export default function LoginForm() {
  const loginSchema = z.object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email")
      .trim(),
    password: z
      .string({ required_error: "Password must have at least 8 characters" })
      .min(8, "Password must have at least 8 characters")
      .trim(),
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ rememberMe: false });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const user = await validateUser(data.email, data.password);
      if (!user) {
        setIsValid(2);
        toast.error("Login failed! Try 'Forgot password?' ");
      } else {
        setIsValid(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set("userId", user.id);
        toast.success("Login successful!");
        router.push("/dashboard?" + params.toString());
      }
    } catch (error) {
      setIsValid(2);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Reset link sent to your email!");
      setShowForgotPassword(false);
    } catch (error) {
      toast.error("Failed to send reset link");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login clicked`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        autoComplete="off"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full relative pb-5">
              <FormLabel className="text-gray-800 text-xs">Email</FormLabel>
              <FormControl>
                <div className="relative bg-gray-200 rounded-sm">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 w-full text-foreground "
                  />
                </div>
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
                <div className="relative bg-gray-200  rounded-sm">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 w-full text-foreground"
                    autoComplete="new-password"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs absolute left-0 bottom-0" />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center mb-2">
          <div className="flex pb-2">
            <Switch
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, rememberMe: checked })
              }
            />
            <Label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </Label>
          </div>
          <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:text-prussian-blue">
              Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white hover:bg-prussian-blue"
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
