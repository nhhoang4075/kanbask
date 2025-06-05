"use client";

import { Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/hooks/use-account";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

export default function AccountHeader() {
  const { account, handleUploadAvatar } = useAccount();

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (file) {
      await handleUploadAvatar(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Avatar className="h-24 w-24 mb-4 border-1 border-prussian-blue/50">
          <AvatarImage src={account.avatar_url} alt={account.full_name} className="object-cover" />
          <AvatarFallback className="text-2xl" style={pickAvatarColor(account.full_name)}>
            {getInitials(account.full_name)}
          </AvatarFallback>
        </Avatar>
        <Label
          htmlFor="avatar-upload"
          className="absolute bottom-4 right-0 bg-prussian-blue text-white rounded-full p-2 cursor-pointer hover:bg-prussian-blue/90 transition-colors"
        >
          <Camera className="h-4 w-4" />
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="hidden"
          />
        </Label>
      </div>
      <h1 className="text-2xl font-bold text-center">{account.full_name}</h1>
      <p className="text-muted-foreground text-center">{account.email}</p>
    </div>
  );
}
