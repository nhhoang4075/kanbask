import { ListTodo } from "lucide-react";

import { useSearch } from "@/hooks/use-search";
import { capitalCase } from "@/lib/utils";

export default function SearchItemTask({ task }) {
  const { setOpen } = useSearch();

  return (
    <li
      className="flex items-center justify-between gap-4 mx-6 my-2 py-2 px-4 text-left text-md rounded-md bg-white hover:bg-prussian-blue/5 cursor-pointer transition-colors duration-200 ease-in-out"
      onClick={() => {
        setOpen(false);

        window.open(
          `/app/task?team=${task.team_id}&project=${task.project_id}&task=${task.id}`,
          "_self"
        );
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-prussian-blue/20">
        <ListTodo className="h-6 w-6 text-prussian-blue" />
      </div>
      <div className="grid flex-1 text-left text-md">
        <span className="truncate font-medium">{task.title}</span>
        <div className="flex items-center gap-2 divide-x divide-gray-500">
          {task.status && (
            <span className="truncate text-xs text-muted-foreground pr-2">{`Status: ${capitalCase(
              task.status
            )}`}</span>
          )}
          {task.priority && (
            <span className="truncate text-xs text-muted-foreground pr-2">{`Priority: ${capitalCase(
              task.priority
            )}`}</span>
          )}
        </div>
      </div>
    </li>
  );
}
