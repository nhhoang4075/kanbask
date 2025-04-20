"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/UserActions";
import { cn } from "@/lib/utils";
import { User, Mail, LockKeyhole, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export default function RegisterForm() {
  const RegisterSchema = z
    .object({
      firstname: z
        .string({ required_error: "First name is required" })
        .min(1, "First name is required")
        .trim(),
      lastname: z.string().min(1, "Last name is required"),
      email: z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email")
        .trim(),
      password: z
        .string({ required_error: "Password must have at least 8 characters" })
        .min(8, "Password must have at least 8 characters")
        .trim(),
      confirm: z.string().min(1, "Confirm password is required"),
      dob: z.date({
        required_error: "A date of birth is required."
      })
    })
    .refine((data) => data.password === data.confirm, {
      message: "Passwords don't match",
      path: ["confirm"]
    });

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirm: "",
      dob: undefined
    }
  });
  const [step, setStep] = useState(1);
  const [isValid, setIsValid] = useState(0);
  const router = useRouter();

  const onSubmit = async (data) => {
    console.log("onSubmit called with data:", data);
    try {
      const userExists = await registerUser(
        data.firstname,
        data.lastname,
        data.email,
        data.password
      );
      if (userExists === "Email already exists") {
        setIsValid(3);
        toast.error("Email already exists!");
      } else {
        setIsValid(1);
        toast.success("Registration successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      setIsValid(2);
      console.error("Register error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="space-y-5">
        {step === 1 && (
          <>
            <FormField
              name="firstname"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative w-full pb-5">
                  <FormLabel className="text-gray-800 text-xs">Your name:</FormLabel>
                  <div className="relative">
                    <User className="z-10 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your first name"
                        className="pl-10 h-12 text-foreground rounded-sm bg-gray-200"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="relative w-full pb-5">
                  <FormLabel className="text-gray-800 text-xs">Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-12 text-foreground rounded-sm bg-gray-200 justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="z-10 text-gray-600 h-5 w-5 mr-2" />
                          {field.value ? (
                            <span className="font-normal text-left">
                              {format(field.value, "PPP")}
                            </span>
                          ) : (
                            <span className="font-normal text-left">Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 bg-blue-green text-ghost-white text-md hover:bg-prussian-blue"
              onClick={() => setStep(2)}
            >
              Next
            </Button>
            <div className="border-t border-gray-300 mb-6 mt-5"></div>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-500 hover:text-prussian-blue">
                Login
              </Link>
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative w-full pb-5">
                  <FormLabel className="text-gray-800 text-xs">Email:</FormLabel>
                  <div className="relative">
                    <Mail className="z-10 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12 text-foreground rounded-sm bg-gray-200"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative w-full pb-5">
                  <FormLabel className="text-gray-800 text-xs">Password:</FormLabel>
                  <div className="relative">
                    <LockKeyhole className="z-10 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 h-12 text-foreground rounded-sm bg-gray-200"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <FormField
              name="confirm"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative w-full pb-5">
                  <FormLabel className="text-gray-800 text-xs">Confirm Password:</FormLabel>
                  <div className="relative">
                    <LockKeyhole className="z-10 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 h-12 text-foreground rounded-sm bg-gray-200"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs absolute left-0 bottom-0" />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center mb-2">
              <Button
                type="button"
                className="w-1/3 h-12 bg-gray-400 text-ghost-white text-md hover:bg-gray-500 mr-2"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-1/3 h-12 bg-blue-green text-ghost-white text-md hover:bg-prussian-blue"
              >
                Register
              </Button>
            </div>
            <div className="border-t border-gray-300 mb-6 mt-6"></div>
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-500 hover:text-prussian-blue">
                Login
              </Link>
            </p>
          </>
        )}
      </form>
    </Form>
  );
}
