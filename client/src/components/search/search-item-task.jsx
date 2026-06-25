import { useRouter } from "next/navigation";
import { ListTodo } from "lucide-react";

import { useSearch } from "@/hooks/use-search";
import { capitalCase } from "@/lib/utils";

export default function SearchItemTask({ task }) {
  const { setOpen } = useSearch();
  const router = useRouter();

  return (
    <li
      className="flex items-center justify-between gap-4 mx-6 my-2 py-2 px-4 text-left text-md rounded-md bg-white hover:bg-prussian-blue/5 cursor-pointer transition-colors duration-200 ease-in-out"
      onClick={() => {
        setOpen(false);
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-prussian-blue/20">
        <ListTodo className="h-6 w-6 text-prussian-blue" />
      </div>
      <div className="grid flex-1 text-left text-md">
        <span className="truncate font-medium">{task.title}</span>
        <span className="truncate text-xs text-muted-foreground">{`Status: ${capitalCase(
          task.status
        )}`}</span>
      </div>
    </li>
  );
}
