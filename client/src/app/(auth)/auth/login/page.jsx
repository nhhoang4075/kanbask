"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast } from "react-toastify";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import LoginForm from "@/components/AuthComponents/LoginForm";
import { validateUser } from "@/lib/UserActions";

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
          {/* <div className="flex items-center justify-center text-white flex-1">
          <AspectRatio
          >
            <Image
              src="https://images.unsplash.com/photo-1520962880247-cfaf541c8724?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVhY2V8ZW58MHx8MHx8fDA%3D"
              alt="Photo by Drew Beamer"
              fill
              className="h-full w-full rounded-md object-cover"
            />
          </AspectRatio>
          </div> */}
          <div className="bg-gray-50 shadow-lg p-6 flex-1 max-w-md flex flex-col justify-center">
            <div className="space-y-10">
              <p className="text-left text-bold text-black text-xl ">
                {randomGreeting}
              </p>
              <LoginForm />
              <div className=" border-t border-gray-300"></div>
              <p className=" text-center">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="ml-2 text-blue-600 hover:text-prussian-blue"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
