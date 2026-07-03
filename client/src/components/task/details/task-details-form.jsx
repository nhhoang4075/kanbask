"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/hooks/use-project";
import { cn, capitalCase, formatDateShort } from "@/lib/utils";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { pickStatusColor, pickPriorityColor } from "@/lib/task-utils";

const taskFormSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .trim()
    .nullable(),
  status: z.enum(["todo", "in_progress", "done", "review", "canceled", ""]).nullable(),
  priority: z.enum(["low", "medium", "high", ""]).nullable(),
  assignees: z.array(z.string().uuid()),
  due_date: z.coerce.date().nullable(),
  completed_at: z.coerce.date().nullable()
});

export default function TaskDetailsForm({ task, onSubmit, initialValues }) {
  // If initialValues are provided, use them to set default values
  if (initialValues) {
    task = {
      assignees: [],
      ...task,
      ...initialValues
    };
  }

  const { projectMembers } = useProject();

  const availableMembers = projectMembers?.filter(
    (member) => !task?.assignees.some((assignee) => assignee.id === member.id)
  );

  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || null,
      priority: task?.priority || null,
      assignees: task?.assignees.map((a) => a.user_id) || [],
      due_date: task?.due_date ? new Date(task.due_date) : null,
      completed_at: task?.completed_at || null
    }
  });

  return (
    <Form {...form}>
      <form
        id="task-details-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        autoComplete="off"
        spellCheck="false"
      >
        <ScrollArea className="h-[calc(100vh-180px)] px-6 pb-6">
          <div className="grid grid-cols-[100px_1fr] gap-y-4 gap-x-6 items-start">
            {/* Task Name */}
            <Label htmlFor="task-title" className="text-muted-foreground font-normal pt-3">
              Task title
            </Label>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      {...field}
                      id="task-title"
                      placeholder="Type here"
                      className="border-none shadow-none hover:bg-prussian-blue/5 focus-visible:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Status */}
            <Label htmlFor="task-status" className="text-muted-foreground font-normal pt-3">
              Status
            </Label>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="group flex gap-2 items-center">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id="task-status"
                          className="w-full [&_svg]:hidden border-none shadow-none hover:bg-prussian-blue/5 data-[state=open]:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out group-hover:bg-prussian-blue/5"
                        >
                          {field.value ? (
                            <SelectValue placeholder="Select status" />
                          ) : (
                            <p className="text-muted-foreground">Select status</p>
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["todo", "in_progress", "review", "done", "canceled"].map((status) => (
                          <SelectItem key={status} value={status}>
                            <Badge
                              variant="outline"
                              className={cn("rounded-md", pickStatusColor(status))}
                            >
                              {capitalCase(status)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 hover:bg-prussian-blue/5 transition-colors duration-200 ease-in-out"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear status</span>
                      </Button>
                    )}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Priority */}
            <Label htmlFor="task-priority" className="text-muted-foreground font-normal pt-3">
              Priority
            </Label>
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="group flex gap-2 items-center">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          id="task-priority"
                          className="w-full [&_svg]:hidden border-none shadow-none hover:bg-prussian-blue/5 data-[state=open]:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out group-hover:bg-prussian-blue/5"
                        >
                          {field.value ? (
                            <SelectValue placeholder="Select status" />
                          ) : (
                            <p className="text-muted-foreground">Select status</p>
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["low", "medium", "high"].map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            <Badge
                              variant="outline"
                              className={cn("rounded-md", pickPriorityColor(priority))}
                            >
                              {capitalCase(priority)}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 hover:bg-prussian-blue/5 transition-colors duration-200 ease-in-out"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear priority</span>
                      </Button>
                    )}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Assignees */}
            <Label htmlFor="task-assignees" className="text-muted-foreground font-normal pt-3">
              Assignees
            </Label>
            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="task-assignees"
                        variant="outline"
                        role="combobox"
                        className="flex items-center flex-wrap h-fit px-3 font-normal justify-start w-full border-none shadow-none hover:bg-prussian-blue/5 data-[state=open]:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out group-hover:bg-prussian-blue/5"
                      >
                        {field.value.length > 0 ? (
                          <div className="flex flex-wrap gap-2 w-full">
                            {field.value.map((assigneeId) => {
                              const member = projectMembers.find((m) => m.id === assigneeId);

                              return (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs bg-mustard/50 max-w-2/5"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      className="object-cover"
                                      src={member.avatar_url}
                                      alt={member.full_name}
                                    />
                                    <AvatarFallback style={pickAvatarColor(member.full_name)}>
                                      {getInitials(member.full_name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="truncate">{member.full_name}</span>
                                  <div
                                    className="h-4 w-4 p-0 hover:text-prussian-blue cursor-pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      field.onChange(field.value.filter((id) => id !== member.id));
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Select assignees</p>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" onWheel={(e) => e.stopPropagation()}>
                      <Command>
                        <CommandInput placeholder={"Search members"} />
                        <CommandEmpty>No members found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="max-h-[300px] overflow-y-auto">
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
                                      alt={member.full_name}
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
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Due Date */}
            <Label htmlFor="task-due-date" className="text-muted-foreground font-normal pt-3">
              Due date
            </Label>
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="group flex gap-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id="task-due-date"
                            variant="outline"
                            className={cn(
                              "flex-1 p-3 font-normal justify-start border-none shadow-none hover:bg-prussian-blue/5 data-[state=open]:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out group-hover:bg-prussian-blue/5",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? formatDateShort(field.value) : "Select date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            task?.created_at &&
                            date < new Date(task.created_at).setHours(0, 0, 0, 0)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 hover:bg-prussian-blue/5 transition-colors duration-200 ease-in-out"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear due date</span>
                      </Button>
                    )}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Completed At */}
            <Label htmlFor="task-completed-at" className="text-muted-foreground font-normal pt-3">
              Completed at
            </Label>
            <FormField
              control={form.control}
              name="completed_at"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="group flex gap-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id="task-completed-at"
                            variant="outline"
                            className={cn(
                              "flex-1 p-3 font-normal justify-start border-none shadow-none hover:bg-prussian-blue/5 data-[state=open]:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out group-hover:bg-prussian-blue/5",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? formatDateShort(field.value) : "Select date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            task?.created_at &&
                            date < new Date(task.created_at).setHours(0, 0, 0, 0)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 hover:bg-prussian-blue/5 transition-colors duration-200 ease-in-out"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear completed at</span>
                      </Button>
                    )}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Description */}
            <Label htmlFor="task-description" className="text-muted-foreground font-normal pt-3">
              Description
            </Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      {...field}
                      id="task-description"
                      placeholder="Type here"
                      className="min-h-36 max-h-64 border-none shadow-none hover:bg-prussian-blue/5 focus-visible:bg-blue-green/15 focus-visible:ring-0 transition-colors duration-200 ease-in-out"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
}
