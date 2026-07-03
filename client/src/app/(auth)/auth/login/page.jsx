import Image from "next/image";

import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login",
  description: "Login to your Kanbask account"
};

export default function LoginPage() {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="relative flex-1">
        <Image
          src="https://images.unsplash.com/photo-1743309425925-72a2e4dbb8a4?q=80&w=3475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="login thumbnail"
          fill
          quality={100}
          priority={true}
          className="h-full w-full rounded-r-xl object-cover"
        />
      </div>
      <div className="flex-1 max-w-[500px] p-12 shadow-lg bg-ghost-white flex flex-col justify-center ">
        <LoginForm />
      </div>
    </div>
  );
}
