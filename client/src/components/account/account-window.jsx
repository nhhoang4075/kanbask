"use client";

import { useState } from "react";

import Spinner from "@/components/app/spinner";
import AccountHeader from "@/components/account/account-header";
import AccountInformation from "@/components/account/account-information";
import AccountActions from "@/components/account/account-actions";
import { useAccount } from "@/hooks/use-account";

export default function AccountWindow() {
  const { loading } = useAccount();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return (
      <div className="h-full w-full bg-white rounded-md flex items-center">
        <Spinner size="lg" className="-translate-y-6" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white rounded-md overflow-auto">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <AccountHeader />

        <AccountInformation isEditing={isEditing} setIsEditing={setIsEditing} />

        {!isEditing && <AccountActions />}
      </div>
    </div>
  );
}
