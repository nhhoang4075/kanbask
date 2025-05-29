import Image from "next/image";

import RegisterForm from "@/components/auth/register-form";

export const metadata = {
  title: "Register",
  description: "Create your Kanbask account"
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="relative flex-1">
        <Image
          src="https://images.unsplash.com/photo-1747134392520-e3181e0bc399?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="register thumbnail"
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
