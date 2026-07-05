"use client";

import { useEffect, useState } from "react";
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

export default function TransferTeamOwnershipDialog({ isOpen, onOpenChange, team, listParams }) {
  const { getTeamDetail, handleTransferTeamOwnership } = useAdmin();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        userId: z.string().min(1, "Please select a member")
      })
    ),
    defaultValues: {
      userId: ""
    }
  });

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadMembers() {
      setLoadingMembers(true);
      try {
        const detail = await getTeamDetail(team.id);
        if (!cancelled) {
          setMembers((detail.members || []).filter((member) => member.id !== team.owner_id));
        }
      } finally {
        if (!cancelled) setLoadingMembers(false);
      }
    }

    loadMembers();
    form.reset({ userId: "" });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, team.id]);

  const handleSubmit = async (formData) => {
    await handleTransferTeamOwnership(team.id, formData.userId, listParams);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Transfer Ownership</DialogTitle>
          <DialogDescription>Transfer ownership of {team.name} to another member</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="transfer-team-ownership-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            autoComplete="off"
            spellCheck="false"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="relative pb-5">
                  <FormLabel className="text-xs !text-black">New Owner</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={loadingMembers ? "Loading members..." : "Select a member"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name} ({member.email})
                          </SelectItem>
                        ))}
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
            form="transfer-team-ownership-form"
            disabled={form.formState.isSubmitting || members.length === 0}
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
