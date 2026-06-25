import { cn } from "@/lib/utils";

export default function Spinner({ size = "md", className }) {
  const sizes = {
    sm: "!h-4 !w-4",
    md: "!h-6 !w-6",
    lg: "!h-8 !w-8",
    xl: "!h-10 !w-10",
    "2xl": "!h-12 !w-12",
    "3xl": "!h-16 !w-16"
  };
  const sizeClassName = sizes[size] || sizes.md;

  return (
    <div className={cn("sk-fold mx-auto my-auto", sizeClassName, className)}>
      <div className="sk-fold-cube"></div>
      <div className="sk-fold-cube"></div>
      <div className="sk-fold-cube"></div>
      <div className="sk-fold-cube"></div>
    </div>
  );
}
