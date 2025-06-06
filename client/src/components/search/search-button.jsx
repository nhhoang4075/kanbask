"use client";

import { useState, useEffect, useMemo } from "react";
import { SearchIcon } from "lucide-react";

import SearchDialog from "@/components/search/search-dialog";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSearch } from "@/hooks/use-search";

/**
 * Detect if the user is on a Mac platform
 */
function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const platform =
      navigator.userAgentData?.platform ||
      (typeof navigator !== "undefined" && navigator.platform) ||
      "";

    const macMatch = /mac|iphone|ipad|ipod/i;
    setIsMac(macMatch.test(platform));
  }, []);

  return isMac;
}

export default function SearchButton({ className, ...props }) {
  const { open, setOpen } = useSearch();
  const { open: sidebarOpen } = useSidebar();
  const isMac = useIsMac();

  // Memoize the shortcut label
  const shortcutLabel = useMemo(() => {
    return isMac ? "⌘ + K" : "Ctrl + K";
  }, [isMac]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.key) return;

      const key = e.key.toLowerCase();
      const hotkey = isMac ? e.metaKey && key === "k" : e.ctrlKey && key === "k";
      if (hotkey) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle />
            <DialogTrigger asChild>
              <SidebarMenuButton
                tooltip="Search"
                {...props}
                isActive={open}
                onClick={() => setOpen((prev) => !prev)}
                className="mt-4 h-8 text-xs font-medium border-ring bg-ghost-white text-prussian-blue/70"
              >
                {sidebarOpen ? (
                  <div className="flex items-center gap-1.5">
                    <SearchIcon className="h-4 w-4 shrink-0" />
                    <span className="shrink-0">{`Search (${shortcutLabel})`}</span>
                  </div>
                ) : (
                  <SearchIcon className="h-4 w-4" />
                )}
              </SidebarMenuButton>
            </DialogTrigger>
            <SearchDialog />
          </Dialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
