"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { FiLock, FiUser, FiMail } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/lib/UserActions";
import { useRouter } from "next/navigation";

const RegisterSchema = z.object({
    fullname: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
});

export default function Register() {
    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            fullname: '',
            username: '',
            email: '',
            password: '',
            confirm: '',},
  });
    const searchParams = useSearchParams();
    // 0: not submitted, 1: success, 2: error, 3: username exists
    const [isValid, setIsValid] = useState(0);
    const router = useRouter();
    const onSubmit = async (data) => {
        try {
            const newUser = await registerUser(data.fullname, data.username, data.email, data.password);
            if (newUser === "Username already exists") {
                setIsValid(3);
            } else if (!newUser) {
                setIsValid(2);
            } else {
                setIsValid(1);
                const params = new URLSearchParams(searchParams.toString());
                params.set('userId', newUser.id);
                router.push("/dashboard?" + params.toString());
            }
        } catch (error) {
            setIsValid(2);
            console.error("Register error:", error);
            }
        };
    return (
        <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                name="fullname"
                                control={form.control}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fullname:</FormLabel>
                                    <FormControl>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input
                                        {...field}
                                        type="text"
                                        required
                                        className="pl-10" // Add padding-left to avoid overlapping with the icon
                                        />
                                    </div>
                                    </FormControl>
                                    <FormDescription>This is your full name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
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
                                            required
                                            className="pl-10" // Add padding-left to avoid overlapping with the icon
                                            />
                                        </div>
                                        </FormControl>
                                        <FormDescription>Enter your email.</FormDescription>
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
                                            required
                                            className="pl-10" // Add padding-left to avoid overlapping with the icon
                                            />
                                        </div>
                                        </FormControl>
                                        <FormDescription>Enter your password.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="confirm"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm your password:</FormLabel>
                                        <FormControl>
                                        <div className="relative">
                                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <Input
                                            {...field}
                                            type="password"
                                            required
                                            className="pl-10" // Add padding-left to avoid overlapping with the icon
                                            />
                                        </div>
                                        </FormControl>
                                        <FormDescription>Check your password.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {(isValid == 1) && <p className="text-green-500">Register successful!</p>}
                            {(isValid == 2) && <p className="text-red-500">Registration failed. Please try again later.</p>}
                            {(isValid == 3) && <p className="text-red-500">Username already exists!</p>}
                            <p className="mt-4 text-center">
                                Already have an account? <a href="/" className="text-blue-500">Login</a>
                            </p>
                            <Button type="submit" className="w-full">Register</Button>
                        </form>
                    </Form>
            </div>
        </div>
    );
}
