"use client";

import CreateTeamForm from "@/components/team/actions/create-team-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function CreateTeamSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Create Team</SheetTitle>
          <SheetDescription>Add a new team to your collaboration space</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <CreateTeamForm onOpenChange={onOpenChange} />
        </div>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-team-form"
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
