"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiLock, FiUser, FiMail } from "react-icons/fi";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { validateUser } from "@/lib/UserActions";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "@/components/ui/switch"; 
import LoginForm from "@/components/AuthComponents/LoginForm"; 

const greetings = [
  "Nice to see you again",
  "Welcome back!",
  "Hope you're having a great day!",
  "Let's get started!",
  "Good to see you!",
  "Ready to conquer the day?",
];

export default function Login() {
  const [randomGreeting, setRandomGreeting] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setRandomGreeting(greetings[randomIndex]);
  }, []);

  const loginSchema = z.object({
    email: z.string({required_error:"Email is required"}).min(1, "Email is required").email("Invalid email").trim(),
    password: z.string({required_error:"Password must have at least 8 characters"}).min(8, "Password must have at least 8 characters").trim(),
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
      console.error("Login error:", error);
      toast.error("Wrong password or email. Please try again.");
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
    
    <div className="min-h-screen min-w-screen bg-stone-200 flex">
      <div className="flex flex-col items-center "> 
      
        <div className="min-h-screen min-w-screen flex items-stretch justify-center rounded-lg shadow-lg overflow-hidden bg-white">
          <div className="bg-[#1f1f59] flex items-center justify-center text-white flex-1">
            <img
              src="https://images.unsplash.com/photo-1520962880247-cfaf541c8724?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVhY2V8ZW58MHx8MHx8fDA%3D"
              alt="login illustration"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-gray-50 shadow-lg p-6 flex-1 max-w-md flex flex-col justify-center">
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
                          <FormLabel className="text-gray-800 text-xs">Email:</FormLabel>
                          <FormControl>
                            <div className="relative bg-gray-200 rounded-sm">
                              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="pl-10 w-full text-foreground"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-prussian-blue" disabled={loading}>
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
                <div className="space-y-10">
                  <p className="text-left text-bold text-black text-xl ">{randomGreeting}</p>
                  <LoginForm/>
                  <div className=" border-t border-gray-300"></div>
                  <p className=" text-center">
                    Don't have an account? <a href="/register" className="ml-2 text-blue-600 hover:text-prussian-blue">Sign up now</a>
                  </p>
                </div>
              </>
            )}
          </div>
          
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
