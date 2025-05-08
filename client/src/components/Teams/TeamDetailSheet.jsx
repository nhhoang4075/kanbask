"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "../ui/switch";

export function TeamDetailSheet({ isOpen, onOpenChange, team, onTeamUpdate, edit }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: team?.name || "",
    description: team?.description || ""
  });

  // Update form data when team changes
  useEffect(() => {
    if (team) {
      setEditFormData({
        name: team.name || "",
        description: team.description || ""
      });
      setIsEditMode(false);
    }
  }, [team]);

  const handleSaveTeamChanges = () => {
    // Create updated team data
    const updatedTeam = {
      ...team,
      name: editFormData.name,
      description: editFormData.description,
      updatedAt: new Date().toISOString().split("T")[0] // Update the date
    };

    // Call the update function passed from parent
    if (onTeamUpdate) {
      onTeamUpdate(team.id, updatedTeam);
    }

    // Switch back to view mode
    setIsEditMode(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Team" : "Team Details"}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Make changes to team information" : "View team information"}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name" className="text-lg">
              Team Name
            </Label>
            {isEditMode ? (
              <Input
                id="team-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            ) : (
              <div className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                {editFormData.name}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team-description" className="text-lg">
              Description
            </Label>
            {isEditMode ? (
              <Textarea
                id="team-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
              />
            ) : (
              <div className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm min-h-[80px]">
                {editFormData.description || (
                  <span className="text-muted-foreground">No description provided</span>
                )}
              </div>
            )}
          </div>
          {team && (
            <div className="grid gap-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created By:</span>
                <span>{team.createdBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created At:</span>
                <span>{team.createdAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{team.updatedAt}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Members:</span>
                <span>{team.members.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects:</span>
                <span>{team.projects.length}</span>
              </div> */}
              {isEditMode ? (
                <div className="flex items-center justify-between">
                  <Label htmlFor="manual-join" className="flex-grow">
                    Require approval for new members
                    <p className="text-xs text-muted-foreground">
                      When enabled, new members must be approved before joining
                    </p>
                  </Label>
                  <Switch
                    id="manual-join"
                    checked={team.manualJoinApproval}
                    onCheckedChange={(checked) =>
                      setEditFormData({
                        ...editFormData,
                        manualJoinApproval: checked
                      })
                    }
                  />
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Manual Join Approval:</span>
                  <span>{team.settings?.manualJoinApproval ? "Enabled" : "Disabled"}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <SheetFooter>
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTeamChanges}>Save Changes</Button>
            </>
          ) : (
            <>
              <SheetClose
                variant="outline"
                className="px-4 py-1.5 font-medium bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Close
              </SheetClose>
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
