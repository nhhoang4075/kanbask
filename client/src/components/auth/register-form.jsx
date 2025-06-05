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
import { Input } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { register } from "@/actions/auth-actions";

const greetings = [
  "Start your journey with us!",
  "Let's create something amazing!",
  "Your adventure begins here!",
  "Join our creative community!",
  "Ready to make an impact?",
  "Welcome to the team!",
  "Let's build together!",
  "Your story starts now!"
];

const RegisterSchema = z
  .object({
    full_name: z
      .string({ required_error: "Full name is required" })
      .min(1, "Full name is required")
      .max(100, "Full name must be less than 100 characters")
      .trim(),
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
      .trim(),
    confirm: z
      .string()
      .min(1, "Confirm password is required")
      .max(255, "Password must be less than 255 characters")
      .trim()
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"]
  });

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [randomGreeting, setRandomGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const totalSteps = 2;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setRandomGreeting(greetings[randomIndex]);
  }, []);

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm: ""
    },
    mode: "onChange"
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      toast.success("Registration successful!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    const personalInfoValid = await form.trigger(["full_name", "email"]);
    if (personalInfoValid) {
      setStep(2);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-prussian-blue mb-2">Register</h2>
        <p className="text-gray-600 min-h-6 whitespace-pre">{randomGreeting}</p>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="w-full h-2 bg-prussian-blue/5 rounded-full">
          <div
            className="h-full bg-blue-green rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-sm ${step >= 1 ? "text-blue-green" : "text-gray-400"}`}>
            Personal Info
          </span>
          <span className={`text-sm ${step >= 2 ? "text-blue-green" : "text-gray-400"}`}>
            Security
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" spellCheck="false">
          {step === 1 && (
            <div className="space-y-2">
              <FormField
                name="full_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative pb-5">
                    <FormLabel className="text-xs !text-black">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your name"
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
              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full h-12 bg-blue-green hover:bg-prussian-blue transition-colors duration-200"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
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
                        placeholder="Create a password"
                        className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-blue-green focus-visible:ring-0 transition-colors duration-200"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage className="absolute left-0 bottom-0 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                name="confirm"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative pb-5">
                    <FormLabel className="text-xs !text-black">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-blue-green focus-visible:ring-0 transition-colors duration-200"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage className="absolute left-0 bottom-0 text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/2 h-12 bg-prussian-blue/5 text-gray-700 hover:bg-prussian-blue/20 transition-colors duration-200"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 h-12 bg-blue-green hover:bg-prussian-blue transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Register
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="flex-1 h-px bg-prussian-blue/30"></div>
          <span className="text-gray-500 text-sm px-2">or</span>
          <div className="flex-1 h-px bg-prussian-blue/30"></div>
        </div>
        <p className="text-gray-600">
          Already have an account?{" "}
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
