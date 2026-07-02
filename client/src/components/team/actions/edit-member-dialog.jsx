import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/custom-input";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";

export default function EditMemberDialog({ isOpen, onOpenChange, member, type }) {
  const { selectedTeam, handleUpdateTeamRoleOfMember } = useTeam();
  const { selectedProject, handleUpdateProjectRoleOfMember } = useProject();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        role: z.string().min(1)
      })
    ),
    defaultValues: {
      role: member.role
    }
  });

  const handleSubmit = async (formData) => {
    if (type === "team") {
      await handleUpdateTeamRoleOfMember(selectedTeam.id, {
        user_id: member.id,
        role: formData.role
      });
    } else if (type === "project") {
      await handleUpdateProjectRoleOfMember(selectedProject.id, {
        user_id: member.id,
        role: formData.role
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Member</DialogTitle>
          <DialogDescription>Update information of {member.full_name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-member-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            autoComplete="off"
            spellCheck="false"
          >
            <FormItem>
              <FormLabel className="text-xs !text-black">Name</FormLabel>
              <FormControl>
                <Input value={member.full_name} disabled className="bg-gray-100" />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel className="text-xs !text-black">Email</FormLabel>
              <FormControl>
                <Input value={member.email} disabled className="bg-gray-100" />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="relative pb-5">
                  <FormLabel className="text-xs !text-black">Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={member.role === "owner"}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        {member.role === "owner" && <SelectItem value="owner">Owner</SelectItem>}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-member-form"
            disabled={form.formState.isSubmitting}
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
