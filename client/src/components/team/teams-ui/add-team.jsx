import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTeam } from "@/hooks/use-team";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const AddTeam = ({ isCreateTeamOpen, setIsCreateTeamOpen, onCreateTeam }) => {
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    join_policy: "auto"
  });

  const onChange = (target, value) => {
    setNewTeamData({
      ...newTeamData,
      [target]: value
    });
  };

  const createTeam = () => {
    onCreateTeam(newTeamData);
    console.log(newTeamData);

    // Reset form
    setNewTeamData({
      name: "",
      description: "",
      join_policy: "auto"
    });
  };

  return (
    <Sheet open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Plus className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Team</SheetTitle>
          <SheetDescription>Add a new team to your organization.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              placeholder="Enter team name"
              value={newTeamData.name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              placeholder="Describe the team's purpose"
              value={newTeamData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="manual-join" className="flex-grow">
              Require approval for new members
              <p className="text-xs text-muted-foreground">
                When enabled, new members must be approved before joining
              </p>
            </Label>
            <Switch
              id="join_policy"
              checked={newTeamData.join_policy}
              onCheckedChange={(checked) => onChange("join_policy", checked ? "auto" : "manual")}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
            Cancel
          </Button>
          <Button onClick={createTeam}>Create Team</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddTeam;
