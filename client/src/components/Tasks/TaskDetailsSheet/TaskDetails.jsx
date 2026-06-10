"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, FileText, Paperclip } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TaskEditDetails from "./TaskEditDetails";
import TaskViewDetails from "./TaskViewDetails";
import TaskDetailsComments from "./TaskDetailComment";
import { FileUpload } from "../FileAttachment/FileUpload";
import { FileAttachmentList } from "../FileAttachment/FileAttachmentList";

const TaskDetails = ({ task, open, onSave, onOpenChange, initialEditMode }) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [activeTab, setActiveTab] = useState("details");
  const [localTask, setLocalTask] = useState(task);

  // Update local task when the task prop changes
  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  // Update the useEffect to respect initialEditMode when opening
  useEffect(() => {
    // Reset editing mode when sheet closes, but set to initialEditMode when opening
    if (!open) {
      setIsEditing(false);
    } else if (open && initialEditMode) {
      setIsEditing(true);
      setActiveTab("details");
    }
  }, [open, initialEditMode]);

  if (!task) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab("details");
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

  const handleAddComment = async (comment) => {
    // Create a new task object with the added comment
    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), comment],
      updatedAt: new Date().toISOString()
    };

    // Call the onSave callback with the updated task
    onSave(updatedTask);
  };

  const handleAddFile = (file) => {
    // Create a new task object with the added file
    const updatedTask = {
      ...localTask,
      attachments: [...(localTask.attachments || []), file],
      updatedAt: new Date().toISOString()
    };

    // Update local state
    setLocalTask(updatedTask);

    // Call the onSave callback with the updated task
    onSave(updatedTask);

    return updatedTask;
  };

  const handleDeleteFile = (fileId) => {
    // Create a new task object with the file removed
    const updatedTask = {
      ...localTask,
      attachments: (localTask.attachments || []).filter((file) => file.id !== fileId),
      updatedAt: new Date().toISOString()
    };

    // Update local state
    setLocalTask(updatedTask);

    // Call the onSave callback with the updated task
    onSave(updatedTask);

    return updatedTask;
  };

  const commentCount = task.comments?.length || 0;
  const fileCount = localTask.attachments?.length || 0;

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Files
              {fileCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {fileCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
              {commentCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {commentCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            {isEditing ? (
              <TaskEditDetails task={task} onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <TaskViewDetails
                task={task}
                onEdit={handleEdit}
                onClose={() => onOpenChange(false)}
              />
            )}
          </TabsContent>
          <TabsContent value="files" className="mt-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Files</h3>
                <FileUpload onFileUpload={handleAddFile} disabled={isEditing} />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {fileCount} {fileCount === 1 ? "attachment" : "attachments"}
                </h4>
                <FileAttachmentList
                  files={localTask.attachments || []}
                  onDelete={handleDeleteFile}
                  readOnly={isEditing}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="comments" className="mt-4">
            <TaskDetailsComments
              task={task}
              onAddComment={handleAddComment}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetails;
