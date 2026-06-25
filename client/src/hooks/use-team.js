"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import {
  createTeam,
  getTeamsOfUser,
  getMembersOfTeam,
  updateTeam,
  deleteTeam,
  addMembersToTeam,
  removeMembersFromTeam,
  updateTeamMemberRole,
  leaveTeam,
  joinTeam,
  approveJoinRequest,
  rejectJoinRequest
} from "@/actions/team-actions";

import { useSession } from "@/hooks/use-session";

const TeamContext = createContext();

export function useTeam() {
  return useContext(TeamContext);
}

export function TeamProvider({ children }) {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Team state
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  // UI state
  // const [activeTab, setActiveTab] = useState("members");
  // const [isOpenTeamDetails, setIsOpenTeamDetails] = useState(false);

  // Fetch teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeamsOfUser();
      setTeams(data.teams);
      if (data.teams.length > 0 && !selectedTeam) {
        setSelectedTeam(data.teams[0]);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam]);

  // Fetch team members
  const fetchTeamMembers = useCallback(
    async (teamId) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMembersOfTeam(teamId);
        setTeamMembers(data.members);
        setIsEditable(data.find((member) => member.id === user?.id)?.role === "owner");
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Initial data fetch
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Fetch team members when team changes
  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam, fetchTeamMembers]);

  // Team actions
  const handleCreateTeam = useCallback(
    async (teamData) => {
      try {
        setLoading(true);
        const newTeam = await createTeam(teamData);
        await fetchTeams();
        setSelectedTeam(newTeam);
        return newTeam;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const handleUpdateTeam = useCallback(
    async (teamId, updates) => {
      try {
        setLoading(true);
        await updateTeam(teamId, updates);
        await fetchTeams();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const handleDeleteTeam = useCallback(
    async (teamId) => {
      try {
        setLoading(true);
        await deleteTeam(teamId);
        await fetchTeams();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const handleJoinTeam = useCallback(
    async (code) => {
      try {
        setLoading(true);
        await joinTeam(code);
        await fetchTeams();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const handleLeaveTeam = useCallback(
    async (teamId) => {
      try {
        setLoading(true);
        await leaveTeam(teamId);
        await fetchTeams();
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const handleAddTeamMembers = useCallback(
    async (teamId, memberIds) => {
      try {
        setLoading(true);
        await addMembersToTeam(teamId, memberIds);
        await fetchTeamMembers(teamId);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamMembers]
  );

  const handleRemoveTeamMembers = useCallback(
    async (teamId, memberIds) => {
      try {
        setLoading(true);
        await removeMembersFromTeam(teamId, memberIds);
        await fetchTeamMembers(teamId);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamMembers]
  );

  const handleUpdateTeamMemberRole = useCallback(
    async (teamId, memberId, role) => {
      try {
        setLoading(true);
        await updateTeamMemberRole(teamId, memberId, role);
        await fetchTeamMembers(teamId);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamMembers]
  );

  const contextValue = {
    // State
    teams,
    selectedTeam,
    teamMembers,
    loading,
    error,
    isEditable,
    // activeTab,
    // isOpenTeamDetails,

    // Setters
    setSelectedTeam,
    // setActiveTab,
    // setIsOpenTeamDetails,

    // Team actions
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    handleJoinTeam,
    handleLeaveTeam,
    handleAddTeamMembers,
    handleRemoveTeamMembers,
    handleUpdateTeamMemberRole
  };

  return <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>;
}
