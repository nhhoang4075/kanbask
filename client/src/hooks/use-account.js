"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

import {
  getMyAccount,
  updateMyProfile,
  changeMyPassword,
  uploadMyAvatar,
  deleteMyAccount
} from "@/actions/user-actions";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

// Context to hold session state and actions
const AccountContext = createContext();

export function useAccount() {
  return useContext(AccountContext);
}

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { refreshSession, logout } = useSession();

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyAccount();
      setAccount(data.user);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleUpdateProfile = useCallback(
    async (data) => {
      try {
        setAccount((prev) => ({ ...prev, ...data }));

        await updateMyProfile(data);
        await refreshSession();
      } catch (err) {
        setError(err);
      }
    },
    [account]
  );

  const handleChangePassword = useCallback(async (data) => {
    try {
      await changeMyPassword(data);
      toast.success("Change password successfully");
    } catch (err) {
      setError(err);
      toast.error("Current password does not match");
    }
  }, []);

  const handleUploadAvatar = useCallback(async (file) => {
    try {
      const avatarData = await uploadMyAvatar(file);
      await refreshSession();

      setAccount((prev) => ({ ...prev, avatar_url: avatarData.avatar_url }));
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteMyAccount();
      await logout();
    } catch (err) {
      console.log(err);
      setError(err);
    }
  }, []);

  const contextValue = {
    account,
    loading,
    error,

    fetchAccount,
    handleUpdateProfile,
    handleChangePassword,
    handleUploadAvatar,
    handleDeleteAccount
  };

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>;
}
