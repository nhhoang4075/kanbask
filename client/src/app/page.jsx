"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { validateUser } from "@/lib/ServerActions";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  // Add a reack-hook-form to manage the form state and validation
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(0); // 0: not submitted, 1: success, 2: error
  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      const user = await validateUser(data.username, data.password);
      if (!user) {
        setIsValid(2);
      } else {
        setIsValid(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set('userId', user.id);
        router.push("/dashboard?" + params.toString());
      }
    } catch (error) {
      setIsValid(2);
      console.error("Login error:", error);
    }
  };
  return (
    <div className="min-w-xs mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <Input {...field} type="text" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input {...field} type="password" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(isValid == 1) && <p className="text-green-500">Login successful!</p>}
          {(isValid == 2) && <p className="text-red-500">Invalid username or password!</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Form>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-500">Register</a>
      </p>
    </div>
  );
}
