"use client";

import CreateTeamForm from "@/components/team/actions/create-team-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";

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
      </SheetContent>
    </Sheet>
  );
}
