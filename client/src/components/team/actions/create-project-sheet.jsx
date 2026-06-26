"use client";

import CreateProjectForm from "@/components/team/actions/create-project-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function CreateProjectSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Create Project</SheetTitle>
          <SheetDescription>Add a new project to your team</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <CreateProjectForm onOpenChange={onOpenChange} />
        </div>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-project-form"
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
