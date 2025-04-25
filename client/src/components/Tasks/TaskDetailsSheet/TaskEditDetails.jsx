"use client";

import { useState } from "react";
import { CalendarIcon, Save, X, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { columnDefinitions, users } from "@/data/tasks";

export function TaskEditDetails({ task, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "To Do",
    priority: task.priority || "medium",
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    assignedTo: task.assignedTo || []
  });
  const [assigneePopoverOpen, setAssigneePopoverOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
  };

  const handleAssigneeToggle = (user) => {
    setFormData((prev) => {
      // Check if user is already assigned
      const isAssigned = prev.assignedTo.some((assignee) => assignee.id === user.id);

      if (isAssigned) {
        // Remove user from assignees
        return {
          ...prev,
          assignedTo: prev.assignedTo.filter((assignee) => assignee.id !== user.id)
        };
      } else {
        // Add user to assignees
        return {
          ...prev,
          assignedTo: [...prev.assignedTo, user]
        };
      }
    });
  };

  const handleSaveChanges = () => {
    // Format the date for API
    const formattedData = {
      ...formData,
      dueDate: formData.dueDate ? formData.dueDate.toISOString().split("T")[0] : null
    };

    onSave({ id: task.id, ...formattedData });
  };

  return (
    <>
      <div className="grid gap-6 py-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title"
            className="text-xl font-semibold"
          />
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {columnDefinitions.map((column) => (
                  <SelectItem key={column.id} value={column.title}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
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
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Task description"
            className="resize-none"
            rows={4}
          />
        </div>

        {/* Assignees */}
        <div className="space-y-2">
          <Label htmlFor="assignees">Assignees</Label>
          <Popover open={assigneePopoverOpen} onOpenChange={setAssigneePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={assigneePopoverOpen}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  {formData.assignedTo.length > 0 ? (
                    <span>
                      {formData.assignedTo.length}{" "}
                      {formData.assignedTo.length === 1 ? "assignee" : "assignees"}
                    </span>
                  ) : (
                    "Select assignees"
                  )}
                </span>
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
                      const isSelected = formData.assignedTo.some(
                        (assignee) => assignee.id === user.id
                      );
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

          {formData.assignedTo.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.assignedTo.map((assignee) => (
                <div
                  key={assignee.id}
                  className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
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

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, "PPP") : "No due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.dueDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <SheetFooter className="pt-4 flex flex-row gap-2 sm:justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </SheetFooter>
    </>
  );
}

export default TaskEditDetails;
