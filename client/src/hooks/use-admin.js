"use client";

import { createContext, useCallback, useContext, useState } from "react";

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

export function AdminProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);

  const [teams, setTeams] = useState([]);
  const [teamsTotal, setTeamsTotal] = useState(0);

  const [projects, setProjects] = useState([]);
  const [projectsTotal, setProjectsTotal] = useState(0);

  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);

  const fetchUsers = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(params);
      setUsers(data.users);
      setUsersTotal(data.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateUserRole = useCallback(
    async (userId, role, params) => {
      try {
        setLoading(true);
        await updateUserRole(userId, role);
        await fetchUsers(params);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const handleSetUserEnabled = useCallback(
    async (userId, isEnabled, params) => {
      try {
        setLoading(true);
        await setUserEnabled(userId, isEnabled);
        await fetchUsers(params);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const handleForceLogoutUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      await forceLogoutUser(userId);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResendPasswordReset = useCallback(async (userId) => {
    try {
      setLoading(true);
      await resendPasswordReset(userId);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeams = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeams(params);
      setTeams(data.teams);
      setTeamsTotal(data.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTransferTeamOwnership = useCallback(
    async (teamId, userId, params) => {
      try {
        setLoading(true);
        await transferTeamOwnership(teamId, userId);
        await fetchTeams(params);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const fetchProjects = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects(params);
      setProjects(data.projects);
      setProjectsTotal(data.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTransferProjectOwnership = useCallback(
    async (projectId, userId, params) => {
      try {
        setLoading(true);
        await transferProjectOwnership(projectId, userId);
        await fetchProjects(params);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects]
  );

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStats();
      setStats(data.stats);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHealth();
      setHealth(data.health);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    loading,
    error,

    users,
    usersTotal,
    fetchUsers,
    getUserDetail,
    handleUpdateUserRole,
    handleSetUserEnabled,
    handleForceLogoutUser,
    handleResendPasswordReset,

    teams,
    teamsTotal,
    fetchTeams,
    getTeamDetail,
    handleTransferTeamOwnership,

    projects,
    projectsTotal,
    fetchProjects,
    getProjectDetail,
    handleTransferProjectOwnership,

    stats,
    fetchStats,

    health,
    fetchHealth
  };

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
}
