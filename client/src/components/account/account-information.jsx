"use client";

import Link from "next/link";
import { Edit, CheckCircle, XCircle, Mail } from "lucide-react";

import AccountEditForm from "@/components/account/account-edit-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/hooks/use-account";

export default function AccountInformation({ isEditing, setIsEditing }) {
  const { account } = useAccount();

  return (
    <div className="space-y-4">
      {!account.email_verified && (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Your email address is not verified. Please verify your email to secure your account.
            </span>
            <Link href="/auth/verify">
              <Button variant="outline" size="sm" className="text-black">
                Verify Email
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and account information</CardDescription>
            </div>
            {!isEditing && (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-prussian-blue hover:bg-prussian-blue/90 min-w-20"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <AccountEditForm account={account} setIsEditing={setIsEditing} />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">First Name</Label>
                    <div className="text-md h-8">{account.first_name}</div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Last Name</Label>
                    <div className="text-md h-8">{account.last_name}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                    <div className="text-md h-8">{account.full_name}</div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                    <div className="text-md h-8">{account.email}</div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      Email Status
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      {account.email_verified ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-red-600 font-medium">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!account.email_verified && (
                    <Link href="/auth/verify">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                        Verify Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
