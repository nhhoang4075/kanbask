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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
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
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirm: '',},
  });
    const [isValid, setIsValid] = useState(0);
    const [showVerify, setShowVerify] = useState(false); 
    const [verificationCode, setVerificationCode] = useState(""); 
    const [tempUser, setTempUser] = useState(null); 
    const router = useRouter();
    const onSubmit = async (data) => {
        console.log("onSubmit called with data:", data); 
        try {
            const userExists = await registerUser(data.firstname, data.lastname, data.email, data.password);
            if (userExists === "Email already exists") {
                setIsValid(3); 
            } else {
                setIsValid(1);
                setTempUser(data); // Lưu thông tin người dùng tạm thời
                toast.success("Verification code sent to your email!");
                setShowVerify(true); // Hiển thị form xác minh
            }
        } catch (error) {
            setIsValid(2);
            console.error("Register error:", error);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (verificationCode === "123456") { // Kiểm tra mã xác minh
            try {
                // Gọi API để ghi dữ liệu vào file users.json
                const newUser = await registerUser(tempUser.firstname, tempUser.lastname, tempUser.email, tempUser.password);
                
                if (newUser) {
                    toast.success("Verification successful! Redirecting to dashboard...");
                    router.push("/dashboard"); // Chuyển hướng sang dashboard
                } else {
                    toast.error("Failed to save user data. Please try again.");
                }
            } catch (error) {
                console.error("Error saving user data:", error);
                toast.error("An error occurred. Please try again.");
            }
        } else {
            toast.error("Invalid verification code. Please try again.");
        }
    };

    return (
        <div className="min-h-screen min-w-screen bg-stone-200 flex">
            <div className="flex flex-col items-center ">
                <div className="min-h-screen min-w-screen flex items-stretch justify-center rounded-lg shadow-lg overflow-hidden bg-white">
                    <div className="bg-gray-50 shadow-lg p-6 flex-1 max-w-md flex flex-col justify-center">
                        {showVerify ? (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Account</h2>
                                <Form {...form}>
                                    <form onSubmit={handleVerifyCode} className="space-y-4">
                                        <FormField
                                            name="verificationCode"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Verification Code:</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                placeholder="Enter 6-digit code"
                                                                value={verificationCode}
                                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                                required
                                                                className="pl-10 w-full"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-prussian-blue">
                                            Verify
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setShowVerify(false)}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500 w-full text-center"
                                        >
                                            Back to Register
                                        </button>
                                    </form>
                                </Form>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="flex space-x-4">
                                        <FormField
                                            name="firstname"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="w-1/2">
                                                    <FormLabel>First name:</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                required
                                                                className="pl-10 w-full"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Enter your first name.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="lastname"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem className="w-1/2">
                                                    <FormLabel>Last name:</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                            <Input
                                                                {...field}
                                                                type="text"
                                                                required
                                                                className="pl-10 w-full"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Enter your last name.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    
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
                                                    className="pl-10"
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
                                                    className="pl-10"
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
                                                    className="pl-10"
                                                    />
                                                </div>
                                                </FormControl>
                                                <FormDescription>Check your password.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {isValid === 1 && <p className="text-green-500">Register successful!</p>}
                                    {isValid === 2 && <p className="text-red-500">Registration failed. Please try again later.</p>}
                                    {isValid === 3 && <p className="text-red-500">Email already exists!</p>}
                                    <p className="mt-4 text-center">
                                        Already have an account? <a href="/" className="text-blue-500 hover:text-prussian-blue">Login</a>
                                    </p>
                                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-prussian-blue">Register</Button>
                                </form>
                            </Form>
                        )}
                    </div>
                    <div className="bg-[#1f1f59] flex items-center justify-center text-white flex-1 max-w-screen max-h-screen">
                        <img
                        src="https://images.unsplash.com/photo-1507187632231-5beb21a654a2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D"
                        alt="login illustration"
                        className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
