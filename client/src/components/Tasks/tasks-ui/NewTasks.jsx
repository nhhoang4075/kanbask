"use client";

import { useState } from "react";
import { CalendarIcon, Check, ChevronsUpDown, User } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { projects, users } from "@/data/tasks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTask } from "@/hooks/use-tasks";

const NewTasks = ({ open, onOpenChange, selectedProject }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState(undefined);
  const [assignees, setAssignees] = useState([]);
  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false);
  const { addTask } = useTask();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: date ? date.toISOString().split("T")[0] : null,
      assignedTo: assignees
    };

    addTask(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDate(undefined);
    setAssignees([]);
  };

  const handleAssigneeToggle = (user) => {
    setAssignees((prev) => {
      // Check if user is already assigned
      const isAssigned = prev.some((assignee) => assignee.id === user.id);

      if (isAssigned) {
        // Remove user from assignees
        return prev.filter((assignee) => assignee.id !== user.id);
      } else {
        // Add user to assignees
        return [...prev, user];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task to {selectedProject.name}</DialogTitle>{" "}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Assignees</Label>
              <Popover open={assigneePopoverOpen} onOpenChange={setAssigneePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={assigneePopoverOpen}
                    className="justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {assignees.length > 0 ? (
                        <span>
                          {assignees.length} {assignees.length === 1 ? "assignee" : "assignees"}
                        </span>
                      ) : (
                        "Select assignees"
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => {
                          const isSelected = assignees.some((assignee) => assignee.id === user.id);
                          return (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={() => handleAssigneeToggle(user)}
                              className="flex items-center gap-2"
                            >
                              <div className={cn("flex-1 flex items-center gap-2")}>
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={user.name}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                              </div>
                              <Check
                                className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {assignees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {assignees.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                    >
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={assignee.avatar || "/placeholder.svg"}
                          alt={assignee.name}
                        />
                        <AvatarFallback className="text-[8px]">
                          {assignee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{assignee.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleAssigneeToggle(assignee)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {assignee.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTasks;
