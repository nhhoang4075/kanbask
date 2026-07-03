import { X, Users, FolderKanban } from "lucide-react";
import { useState, useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/custom-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/hooks/use-search";
import { useChat } from "@/hooks/use-chat";
import { capitalCase, cn } from "@/lib/utils";
import { pickStatusColor } from "@/lib/task-utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

export default function SearchOptions() {
  const { type, setType, options, setOptions } = useSearch();
  const { conversations } = useChat();
  const [convSearch, setConvSearch] = useState("");

  const clearStatus = () => setOptions((prev) => ({ ...prev, status: undefined }));
  const clearConversation = () => {
    setOptions((prev) => ({ ...prev, conversationId: undefined }));
    setConvSearch("");
  };

  // filter conversations by search term
  const filteredConvs = useMemo(() => {
    if (!convSearch) return conversations.filter((c) => !c.is_pending);
    return conversations.filter((c) => {
      console.log("c", c.title, c.is_pending);
      return !c.is_pending && c.title.toLowerCase().includes(convSearch.toLowerCase());
    });
  }, [convSearch, conversations]);

  return (
    <div className="mx-6 text-sm">
      {!type ? (
        <div className="flex space-x-4">
          <Button size="sm" variant="outline" onClick={() => setType("users")}>
            Users
          </Button>
          <Button size="sm" variant="outline" onClick={() => setType("tasks")}>
            Tasks
          </Button>
          <Button size="sm" variant="outline" onClick={() => setType("messages")}>
            Messages
          </Button>
        </div>
      ) : (
        <div className="flex space-x-4 items-center">
          {/* Type chip */}
          <div className="inline-flex items-center h-8 rounded-md gap-1.5 px-3 bg-prussian-blue text-ghost-white">
            <span>{capitalCase(type)}</span>
            <X
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                setType(null);
                clearStatus();
                clearConversation();
              }}
            />
          </div>

          {/* Task status selector or chip */}
          {type === "tasks" &&
            (options.status ? (
              <div className="inline-flex items-center h-8 rounded-md gap-1.5 px-3 bg-mustard text-prussian-blue">
                <span>{capitalCase(options.status)}</span>
                <X className="h-4 w-4 cursor-pointer" onClick={clearStatus} />
              </div>
            ) : (
              <Select
                value={options.status}
                onValueChange={(value) => setOptions((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger
                  size={8}
                  className="h-8 rounded-md gap-1.5 px-3 focus-visible:ring-0"
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {["todo", "in_progress", "review", "done", "canceled"].map((stt) => (
                    <SelectItem key={stt} value={stt}>
                      <Badge className={cn("text-xs font-normal rounded-sm", pickStatusColor(stt))}>
                        {capitalCase(stt)}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

          {/* Message conversation selector with search & scroll or chip */}
          {type === "messages" &&
            (options.conversationId ? (
              <div className="inline-flex items-center h-8 rounded-md gap-1.5 px-3 bg-mustard text-prussian-blue">
                <span className="truncate max-w-40">
                  {conversations.find((c) => c.id === options.conversationId)?.title}
                </span>
                <X className="h-4 w-4 cursor-pointer" onClick={clearConversation} />
              </div>
            ) : (
              <Select
                value={options.conversationId}
                onValueChange={(value) =>
                  setOptions((prev) => ({ ...prev, conversationId: value }))
                }
              >
                <SelectTrigger
                  size={8}
                  className="h-8 rounded-md gap-1.5 px-3 focus-visible:ring-0"
                >
                  <SelectValue placeholder="Posted in" />
                </SelectTrigger>
                <SelectContent className="w-60">
                  <div className="p-2">
                    <Input
                      placeholder="Search conversations"
                      value={convSearch}
                      onChange={(e) => setConvSearch(e.target.value)}
                      className="focus-visible:ring-0"
                    />
                  </div>
                  {/* scrollable list of options */}
                  <div className="max-h-50 overflow-y-auto">
                    {filteredConvs.length ? (
                      filteredConvs.map((conv) => (
                        <SelectItem key={conv.id} value={conv.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 relative">
                              <AvatarImage
                                src={conv.avatar_url}
                                alt={conv.title}
                                className="object-cover"
                              />
                              <AvatarFallback style={pickAvatarColor(conv.title)}>
                                {conv.type === "direct" ? (
                                  getInitials(conv.title)
                                ) : conv.type === "team" ? (
                                  <Users color={pickAvatarColor(conv.title).color} />
                                ) : (
                                  <FolderKanban color={pickAvatarColor(conv.title).color} />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="truncate font-medium max-w-40">{conv.title}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No conversations found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            ))}
        </div>
      )}
    </div>
  );
}
