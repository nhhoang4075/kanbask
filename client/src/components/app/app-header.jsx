import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Header({ name, children }) {
  return (
    // <div className="sticky top-0 flex h-12 items-center rounded-t-md border-b bg-white px-4">
    <div className="shrink-0 flex items-center gap-4 h-12 px-4 rounded-md bg-white">
      <SidebarTrigger />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
      <h1 className="text-lg font-medium">{name}</h1>
      {children}
    </div>
    // </div>
  );
}
