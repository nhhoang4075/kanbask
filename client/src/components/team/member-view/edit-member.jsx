import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import { useTeam } from "@/hooks/use-team";

const EditMember = ({ user }) => {
  const { showData, handleUpdateTeamMemberRole, handleUpdateProjectMemberRole } = useTeam();
  const [role, setRole] = useState(user.original.role);

  const updateMemberRole = () => {
    console.log(role);
    if (showData == "team") {
      handleUpdateTeamMemberRole(user.original.id, role);
    } else {
      handleUpdateProjectMemberRole(user.original.id, role);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-30">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit user profile: {user.original.full_name}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-row w-full justify-center items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={user.original.full_name}
              className="w-full"
              type="text"
              disabled
            />
          </div>
          <div className="flex flex-row w-full justify-center items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              defaultValue={user.original.email}
              className="w-full"
              type="email"
              disabled
            />
          </div>
          <div className="flex flex-row w-full justify-center items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select id="role" className="" defaultValue={role} onValueChange={setRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="owner">Owner</SelectItem>
                  {/* <SelectItem value="admin">Admin</SelectItem> */}
                  <SelectItem value="member">Member</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            type="reset"
            className="bg-white text-black border-gray-600 border-2 hover:bg-gray-300 hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600  hover:bg-blue-800 hover:cursor-pointer"
            onClick={updateMemberRole}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMember;
