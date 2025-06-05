"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/custom-input";
import { useTeam } from "@/hooks/use-team";

const joinTeamSchema = z.object({
  code: z.string({ required_error: "Team code is required" }).min(1, "Team code is required")
});

export default function JoinTeamForm({ onOpenChange }) {
  const { handleJoinTeam } = useTeam();

  const form = useForm({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      code: ""
    }
  });

  const onSubmit = async (formData) => {
    await handleJoinTeam(formData.code);

    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        id="join-team-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        autoComplete="off"
        spellCheck="false"
      >
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative pb-5">
              <FormLabel className="text-xs !text-black">Team Code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter team code"
                  className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </FormControl>
              <FormMessage className="absolute left-0 bottom-0 text-xs" />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
