"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import { registerUser } from "@/lib/UserActions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

import "react-toastify/dist/ReactToastify.css";

const RegisterSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Confirm password is required")
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"]
  });

export default function Register() {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirm: ""
    }
  });
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
      } else {
        setIsValid(1);
        router.push("/dashboard");
      }
    } catch (error) {
      setIsValid(2);
      console.error("Register error:", error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex">
      
      <div className="relative flex-1">
        <Image
          src="https://images.unsplash.com/photo-1507187632231-5beb21a654a2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8NGslMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D"
          alt="Login image"
          fill
          quality={100}
          priority={true}
          className="h-full w-full rounded-r-xl object-cover"
        />
      </div>
      <div className="flex-1 max-w-[500px] p-12 shadow-lg bg-ghost-white flex flex-col justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
