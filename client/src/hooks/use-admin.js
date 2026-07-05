"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  getUserDetail,
  updateUserRole,
  setUserEnabled,
  forceLogoutUser,
  resendPasswordReset,
  getTeams,
  getTeamDetail,
  transferTeamOwnership,
  getProjects,
  getProjectDetail,
  transferProjectOwnership,
  getStats,
  getHealth
} from "@/actions/admin-actions";

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

const DEFAULT_LIST_PARAMS = { limit: 10, offset: 0, q: "" };

export function AdminProvider({ children }) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState(null);

  const [usersParams, setUsersParams] = useState(DEFAULT_LIST_PARAMS);
  const usersQuery = useQuery({
    queryKey: ["admin-users", usersParams],
    queryFn: () => getUsers(usersParams)
  });
  const fetchUsers = useCallback((params) => setUsersParams(params), []);

  const [teamsParams, setTeamsParams] = useState(DEFAULT_LIST_PARAMS);
  const teamsQuery = useQuery({
    queryKey: ["admin-teams", teamsParams],
    queryFn: () => getTeams(teamsParams)
  });
  const fetchTeams = useCallback((params) => setTeamsParams(params), []);

  const [projectsParams, setProjectsParams] = useState(DEFAULT_LIST_PARAMS);
  const projectsQuery = useQuery({
    queryKey: ["admin-projects", projectsParams],
    queryFn: () => getProjects(projectsParams)
  });
  const fetchProjects = useCallback((params) => setProjectsParams(params), []);

  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const data = await getStats();
      return data.stats;
    },
    enabled: false
  });
  const fetchStats = useCallback(
    () =>
      queryClient.fetchQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
          const data = await getStats();
          return data.stats;
        }
      }),
    [queryClient]
  );

  const healthQuery = useQuery({
    queryKey: ["admin-health"],
    queryFn: async () => {
      const data = await getHealth();
      return data.health;
    },
    enabled: false
  });
  const fetchHealth = useCallback(
    () =>
      queryClient.fetchQuery({
        queryKey: ["admin-health"],
        queryFn: async () => {
          const data = await getHealth();
          return data.health;
        }
      }),
    [queryClient]
  );

  const loading =
    usersQuery.isFetching ||
    teamsQuery.isFetching ||
    projectsQuery.isFetching ||
    statsQuery.isFetching ||
    healthQuery.isFetching;

  const error =
    usersQuery.error ||
    teamsQuery.error ||
    projectsQuery.error ||
    statsQuery.error ||
    healthQuery.error ||
    mutationError;

  // Admin mutations always re-pull the current list (invalidating by key
  // prefix refreshes whatever page/search is currently on screen).
  const handleUpdateUserRole = useCallback(
    async (userId, role) => {
      try {
        await updateUserRole(userId, role);
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } catch (err) {
        setMutationError(err);
      }
    },
    [queryClient]
  );

  const handleSetUserEnabled = useCallback(
    async (userId, isEnabled) => {
      try {
        await setUserEnabled(userId, isEnabled);
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } catch (err) {
        setMutationError(err);
      }
    },
    [queryClient]
  );

  const handleForceLogoutUser = useCallback(async (userId) => {
    try {
      await forceLogoutUser(userId);
    } catch (err) {
      setMutationError(err);
    }
  }, []);

  const handleResendPasswordReset = useCallback(async (userId) => {
    try {
      await resendPasswordReset(userId);
    } catch (err) {
      setMutationError(err);
    }
  }, []);

  const handleTransferTeamOwnership = useCallback(
    async (teamId, userId) => {
      try {
        await transferTeamOwnership(teamId, userId);
        await queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      } catch (err) {
        setMutationError(err);
      }
    },
    [queryClient]
  );

  const handleTransferProjectOwnership = useCallback(
    async (projectId, userId) => {
      try {
        await transferProjectOwnership(projectId, userId);
        await queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      } catch (err) {
        setMutationError(err);
      }
    },
    [queryClient]
  );

  const contextValue = {
    loading,
    error,

    users: usersQuery.data?.users ?? [],
    usersTotal: usersQuery.data?.total ?? 0,
    fetchUsers,
    getUserDetail,
    handleUpdateUserRole,
    handleSetUserEnabled,
    handleForceLogoutUser,
    handleResendPasswordReset,

    teams: teamsQuery.data?.teams ?? [],
    teamsTotal: teamsQuery.data?.total ?? 0,
    fetchTeams,
    getTeamDetail,
    handleTransferTeamOwnership,

    projects: projectsQuery.data?.projects ?? [],
    projectsTotal: projectsQuery.data?.total ?? 0,
    fetchProjects,
    getProjectDetail,
    handleTransferProjectOwnership,

    stats: statsQuery.data ?? null,
    fetchStats,

    health: healthQuery.data ?? null,
    fetchHealth
  };

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
}
