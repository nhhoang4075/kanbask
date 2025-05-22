"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const pathname = usePathname();
  let headerName = pathname.split("/app/")[1];
  if (headerName) {
    headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
  } else {
    headerName = "Dashboard";
  }

  return (
    <div className="sticky top-0 flex h-12 items-center rounded-t-md border-b bg-white px-3">
      <div className="flex w-full items-center gap-1 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-lg font-medium">{headerName}</h1>
      </div>
    </div>
  );
}
