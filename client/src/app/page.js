"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiLock, FiUser, FiMail } from "react-icons/fi";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { validateUser } from "@/lib/UserActions";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password is too short"),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(0); // 0: not submitted, 1: success, 2: error
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ rememberMe: false });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const user = await validateUser(data.username, data.password);
      if (!user) {
        setIsValid(2);
        toast.error("Login failed! Try 'Forgot your password?' ");
      } else {
        setIsValid(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set("userId", user.id);
        toast.success("Login successful!");
        router.push("/dashboard?" + params.toString());
      }
    } catch (error) {
      setIsValid(2);
      console.error("Login error:", error);
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
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        {showForgotPassword ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            <Form {...form}>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email:</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 w-full text-center"
                >
                  Back to Login
                </button>
              </form>
            </Form>
          </div>
        ) : (
          <>
            <div className="space-y-4">
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
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              {...field}
                              type="text"
                              placeholder="Type here!"
                              required
                              className="pl-10" // Add padding-left to avoid overlapping with the icon
                            />
                          </div>
                        </FormControl>
                        <FormDescription>This is your public display name.</FormDescription>
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
                          <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              {...field}
                              type="password"
                              placeholder="Type here!"
                              required
                              className="pl-10" // Add padding-left to avoid overlapping with the icon
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Password must be at least 8 characters</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(isValid === 1) && <p className="text-green-500">Login successful!</p>}
                  {(isValid === 2) && <p className="text-red-500">Invalid username or password!</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </Form>
              <p className="mt-4 text-center">
                Don't have an account? <a href="/register" className="text-blue-500">Register</a>
              </p>
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
