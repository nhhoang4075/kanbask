"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, use } from "react";
import { LoginAction } from "@/lib/AuthActions";
import { useRouter } from "next/navigation";
import { loginFormSchema } from "@/schema/auth-schema";

export default function Login() {
  // Add a reack-hook-form to manage the form state and validation
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isValid, setIsValid] = useState(0); // 0: not submitted, 1: success, 2: invaild, 3: error
  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const result = await LoginAction({email: email, password: password});
      if (result){
        setIsValid(1); // Login successful
        router.push(result); // Redirect to dashboard on success
      } else {
        setIsValid(2); // Invalid email or password
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsValid(3); // Error occurred during login
    }
  };
  return (
    <div className="min-w-xs mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input {...field} type="email" required />
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
          {(isValid == 2) && <p className="text-red-500">Invalid email or password!</p>}
          {(isValid == 3) && <p className="text-red-500">Error occurred during login!</p>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Form>
      <p className="mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-500">Register</a>
      </p>
    </div>
  );
}
