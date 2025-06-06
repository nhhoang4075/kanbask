import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/use-notification";

export default function NotificationHeader() {
  const { filterOptions, filter, setFilter, markAllAsRead } = useNotification();

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center text-md font-semibold">
            {filterOptions.find((opt) => opt.value === filter)?.label}
            <ChevronDown className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filterOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              disabled={opt.value === filter}
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="link" size="sm" onClick={markAllAsRead} className="text-sm text-blue-green">
        Mark all as read
      </Button>
    </div>
  );
}
