"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/lib/ServerActions";
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
        <div className="min-w-xs mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        name="fullname"
                        control={form.control}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name:</FormLabel>
                            <FormControl>
                                <Input {...field} type="text" required />
                            </FormControl>
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
                                <Input {...field} type="text" required />
                            </FormControl>
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
                            <FormLabel>New password:</FormLabel>
                            <FormControl>
                            <Input {...field} type="password" required />
                            </FormControl>
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
                            <Input {...field} type="password" required />
                            </FormControl>
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
    );
}
