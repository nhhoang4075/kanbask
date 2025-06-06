import AppHeader from "@/components/app/app-header";

export const metadata = {
  title: "Calendar",
  description: "Your Kanbask calendar"
};

export default function ProfileLayout({ children }) {
  return (
    <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
      <AppHeader name="Calendar" />
      <div className="flex-1 overflow-auto rounded-md">{children}</div>
    </div>
  );
}
