"use client";

import { useEffect, useState } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProjectDetailSheet({ isOpen, onOpenChange, project, onProjectUpdate, edit }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "Active",
    priority: project?.priority || "Medium",
    dueDate: project?.dueDate || ""
  });

  // Update form data when project changes
  useEffect(() => {
    if (project) {
      setEditProjectData({
        name: project.name,
        description: project.description || "",
        status: project.status || "Active",
        priority: project.priority || "Medium",
        dueDate: project.dueDate || ""
      });
      setIsEditMode(false);
    }
  }, [project]);

  const handleSaveProjectChanges = () => {
    // Create updated project data
    const updatedProject = {
      ...project,
      name: editProjectData.name,
      description: editProjectData.description,
      status: editProjectData.status,
      priority: editProjectData.priority,
      dueDate: editProjectData.dueDate,
      updatedAt: new Date().toISOString().split("T")[0]
    };

    // Call the update function passed from parent
    if (onProjectUpdate) {
      onProjectUpdate(project.id, updatedProject);
    }

    // Switch back to view mode
    setIsEditMode(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Project" : "Project Details"}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Make changes to project information" : "View project information"}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            {isEditMode ? (
              <Input
                id="project-name"
                value={editProjectData.name}
                onChange={(e) => setEditProjectData({ ...editProjectData, name: e.target.value })}
              />
            ) : (
              <div className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                {editProjectData.name}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            {isEditMode ? (
              <Textarea
                id="project-description"
                value={editProjectData.description}
                onChange={(e) =>
                  setEditProjectData({ ...editProjectData, description: e.target.value })
                }
                rows={4}
              />
            ) : (
              <div className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm min-h-[80px]">
                {editProjectData.description || (
                  <span className="text-muted-foreground">No description provided</span>
                )}
              </div>
            )}
          </div>
          {project && (
            <div className="grid gap-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{project.createdAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{project.updatedAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team:</span>
                <span>{project.team}</span>
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProjectChanges}>Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {edit && (
                <Button onClick={() => setIsEditMode(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
