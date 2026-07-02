"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

const addMemberSchema = z.object({
  members: z.array(z.string()).min(1, "Please select at least one member")
});

export default function AddMemberDialog({ isOpen, onOpenChange }) {
  const { selectedTeam, teamMembers } = useTeam();
  const { selectedProject, projectMembers, handleAddProjectMembers } = useProject();

  const availableMembers = teamMembers?.filter(
    (member) => !projectMembers.some((projectMember) => projectMember.id === member.id)
  );

  const form = useForm({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      members: []
    }
  });

  const handleSubmit = async (formData) => {
    await handleAddProjectMembers(selectedProject.id, {
      user_ids: formData.members
    });

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Members</DialogTitle>
          <DialogDescription>
            Add team members to collaborate on this project. Members will have access to view and
            contribute to the project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-member-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            autoComplete="off"
            spellCheck="false"
          >
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem className="relative pb-5">
                  <FormLabel className="text-xs !text-black">Members</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length ? (
                            <div className="flex gap-1 overflow-hidden">
                              {field.value.slice(0, 3).map((memberId) => {
                                const member = availableMembers.find((m) => m.id === memberId);

                                return (
                                  <TooltipProvider key={memberId} delayDuration={0}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          key={memberId}
                                          className="max-w-24 px-2 py-0.5 border-1 border-prussian-blue bg-prussian-blue text-white rounded-full text-xs truncate"
                                        >
                                          {member?.full_name}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>{member?.full_name}</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                );
                              })}
                              {field.value.length > 3 && (
                                <div className="max-w-24 px-2 py-0.5 border-1 border-prussian-blue bg-white text-prussian-blue rounded-full text-xs truncate">
                                  +{field.value.length - 3} more
                                </div>
                              )}
                            </div>
                          ) : (
                            `Select members from team ${selectedTeam.name}`
                          )}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[400px] p-0"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <Command>
                          <CommandInput placeholder={"Search members"} />
                          <CommandEmpty>No members found.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="max-h-[200px] overflow-y-auto">
                              {availableMembers?.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  onSelect={() => {
                                    const current = new Set(field.value);
                                    if (current.has(member.id)) {
                                      current.delete(member.id);
                                    } else {
                                      current.add(member.id);
                                    }
                                    field.onChange(Array.from(current));
                                  }}
                                  className="flex items-center justify-between px-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        className="object-cover"
                                        src={member.avatar_url}
                                      />
                                      <AvatarFallback style={pickAvatarColor(member.full_name)}>
                                        {getInitials(member.full_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{member.full_name}</span>
                                  </div>
                                  {field.value?.includes(member.id) && (
                                    <Check className="h-4 w-4 text-prussian-blue" />
                                  )}
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-member-form"
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Add Members
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
