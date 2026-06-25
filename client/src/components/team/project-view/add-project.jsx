"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTeam } from "@/hooks/use-team";

const AddProject = () => {
  const { isOpenAddProject, setIsOpenAddProject, selectedTeam, handleCreateProject } = useTeam();
  const [formData, setFormData] = useState({
    team_id: selectedTeam.id,
    name: "",
    description: ""
  });

  const createProject = (e) => {
    // Create new project object
    const newProject = {
      team_id: selectedTeam.id,
      name: formData.name,
      description: formData.description
    };

    try {
      handleCreateProject(newProject);
    } catch (err) {
      console.log(err);
    } finally {
      // Reset form
      setFormData({
        name: "",
        description: ""
      });
      setIsOpenAddProject(false);
    }
  };

  return (
    <Dialog open={isOpenAddProject} onOpenChange={setIsOpenAddProject}>
      <DialogContent className=" w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Create a new project for {selectedTeam.name}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Describe the project's purpose and goals"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setIsOpenAddProject(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-700" onClick={createProject}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
