"use client";

import { useState, useEffect, useRef } from "react";
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
import { Mail, ArrowLeft } from "lucide-react";

const VerifySchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email")
    .trim(),
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must be numeric")
});

export default function VerifyEmailForm() {
  

  const form = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      email: "",
      code: ""
    }
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(2);
      setCountdown(30);
      setError("");
    } catch (err) {
      setError("Failed to send verification code");
    }
    setLoading(false);
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setError("Please enter complete verification code");
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setError("");
    } catch (err) {
      setError("Invalid verification code");
    }
    setLoading(false);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <Form {...form}>
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-blue-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Verify Email Account
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Enter your email to receive a verification code
                </p>
              </div>

              <div className="space-y-2">
                <FormLabel
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!email || loading}>
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Enter Verification Code
                </h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">We sent a code to {email}</p>

              <div className="flex gap-2 justify-between">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  className="text-blue-500 bg-transparent hover:bg-blue-50"
                  disabled={countdown > 0}
                  onClick={() => {
                    setCountdown(30);
                  }}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={verificationCode.join("").length !== 6 || loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          )}
      </Form>
  );
}
