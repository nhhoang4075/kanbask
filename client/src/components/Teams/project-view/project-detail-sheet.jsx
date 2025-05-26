"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTeamContext } from "@/hooks/use-teams";
import { formatDate } from "@/lib/teams-utils";

export function ProjectDetailSheet({ edit }) {
  const {
    isOpenProjectDetails,
    setIsOpenProjectDetails,
    selectedProject,
    handleUpdateProject,
    editable
  } = useTeamContext();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    name: selectedProject?.name || "",
    description: selectedProject?.description || ""
  });

  // Update form data when project changes
  useEffect(() => {
    if (selectedProject) {
      setEditProjectData({
        name: selectedProject.name,
        description: selectedProject.description || ""
      });
      setIsEditMode(false);
    }
  }, [selectedProject]);

  const handleSaveProjectChanges = async () => {
    // Create updated project data
    const updatedProject = {
      name: editProjectData.name,
      description: editProjectData.description
    };
    await handleUpdateProject(selectedProject.id, updatedProject);
    // Switch back to view mode
    setIsEditMode(false);
    setIsOpenProjectDetails(false);
  };

  return (
    <Sheet open={isOpenProjectDetails} onOpenChange={setIsOpenProjectDetails}>
      <SheetContent className="bg-white">
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
          {selectedProject && (
            <div className="grid gap-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(selectedProject.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{formatDate(selectedProject.updated_at)}</span>
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
              <Button variant="outline" onClick={() => setIsOpenProjectDetails(false)}>
                Close
              </Button>
              {editable && (
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
