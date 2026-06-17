import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { useSearch } from "@/hooks/use-search";

export default function SearchItemUser({ user }) {
  const { setOpen } = useSearch();
  const router = useRouter();

  return (
    <li
      className="flex items-center gap-4 mx-6 my-2 py-2 px-4 text-left text-md rounded-md bg-white hover:bg-prussian-blue/5 cursor-pointer"
      onClick={() => {
        setOpen(false);
      }}
    >
      <Avatar className="h-10 w-10 rounded-full overflow-hidden">
        <AvatarImage src={user.avatar_url} alt={user.full_name} className="object-cover" />
        <AvatarFallback style={pickAvatarColor(user.full_name)}>
          {getInitials(user.full_name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-md">
        <span className="truncate font-medium">{user.full_name}</span>
        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
      </div>
    </li>
  );
}
