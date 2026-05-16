import Image from "next/image";

import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="relative flex-1">
        <Image
          src="https://images.unsplash.com/photo-1520962880247-cfaf541c8724?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVhY2V8ZW58MHx8MHx8fDA%3D"
          alt="Login image"
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
