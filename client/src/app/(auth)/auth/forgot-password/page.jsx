import Image from "next/image";

import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your Kanbask account password"
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="relative flex-1">
        <Image
          src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8NGslMjBsYW5kc2NhcGV8ZW58MHx8MHx8fDA%3D"
          alt="Login image"
          fill
          quality={100}
          priority={true}
          className="h-full w-full rounded-r-xl object-cover"
        />
      </div>
      <div className="flex-1 max-w-[500px] p-12 shadow-lg bg-ghost-white flex flex-col justify-center ">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
