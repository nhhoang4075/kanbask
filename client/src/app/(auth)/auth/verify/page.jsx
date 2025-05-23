import Image from "next/image";

import VerifyEmailForm from "@/components/auth/verify-email-form";

export const metadata = {
  title: "Verify Email",
  description: "Verify your email address for Kanbask"
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="relative flex-1">
        <Image
          src="https://images.unsplash.com/photo-1747607176057-175b357ef4ab?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login image"
          fill
          quality={100}
          priority={true}
          className="h-full w-full rounded-r-xl object-cover"
        />
      </div>
      <div className="flex-1 max-w-[500px] p-12 shadow-lg bg-ghost-white flex flex-col justify-center ">
        <VerifyEmailForm />
      </div>
    </div>
  );
}
