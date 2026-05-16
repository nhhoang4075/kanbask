"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import TaskEditDetails from "./TaskEditDetails";
import TaskViewDetails from "./TaskViewDetails";

const TaskDetails = ({ task, open, onSave, onOpenChange, initialEditMode }) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);

  // Update the useEffect to respect initialEditMode when opening
  useEffect(() => {
    // Reset editing mode when sheet closes, but set to initialEditMode when opening
    if (!open) {
      setIsEditing(false);
    } else if (open && initialEditMode) {
      setIsEditing(true);
    }
  }, [open, initialEditMode]);

  if (!task) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = (updatedTask) => {
    onSave(updatedTask);
    setIsEditing(false);
    // Close the sheet after saving
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="overflow-y-auto"
        onInteractOutside={(e) => {
          // Prevent the event from propagating to avoid focus issues
          e.stopPropagation();
          // If in edit mode, don't close on outside click
          if (isEditing) {
            e.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            {isEditing && "Editing task:"} {task.title}
          </SheetTitle>
        </SheetHeader>

        {isEditing ? (
          <TaskEditDetails task={task} onSave={handleSave} onCancel={handleCancel} />
        ) : (
          <TaskViewDetails task={task} onEdit={handleEdit} onClose={() => onOpenChange(false)} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetails;
