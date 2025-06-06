import AppHeader from "@/components/app/app-header";
import { AccountProvider } from "@/hooks/use-account";

export const metadata = {
  title: "Account",
  description: "Your Kanbask account"
};

export default function ProfileLayout({ children }) {
  return (
    <AccountProvider>
      <div className="flex flex-col gap-2 w-full h-[98dvh] overflow-hidden rounded-md">
        <AppHeader name="Account" />
        <div className="flex-1 overflow-auto rounded-md">{children}</div>
      </div>
    </AccountProvider>
  );
}
