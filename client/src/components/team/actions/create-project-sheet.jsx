"use client";

import CreateProjectForm from "@/components/team/actions/create-project-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

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
      </SheetContent>
    </Sheet>
  );
}
