"use client";

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
import { useAdmin } from "@/hooks/use-admin";

export default function ChangeUserRoleDialog({ isOpen, onOpenChange, user, listParams }) {
  const { handleUpdateUserRole } = useAdmin();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        role: z.enum(["user", "admin"])
      })
    ),
    defaultValues: {
      role: user.role
    }
  });

  const handleSubmit = async (formData) => {
    await handleUpdateUserRole(user.id, formData.role, listParams);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Change Role</DialogTitle>
          <DialogDescription>Update the role of {user.full_name}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="change-user-role-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            autoComplete="off"
            spellCheck="false"
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="relative pb-5">
                  <FormLabel className="text-xs !text-black">Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
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
            form="change-user-role-form"
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
