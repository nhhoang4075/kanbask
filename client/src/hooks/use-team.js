"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import {
  createTeam,
  getTeamsOfUser,
  updateTeam,
  deleteTeam,
  getMembersOfTeam,
  removeMembersFromTeam,
  updateTeamRoleOfMember,
  leaveTeam,
  joinTeam,
  getJoinRequestsOfTeam,
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
  const [teamJoinRequests, setTeamJoinRequests] = useState([]);

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
  }, [user]);

  // Fetch team members
  const fetchTeamMembers = useCallback(
    async (teamId) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMembersOfTeam(teamId);
        setTeamMembers(data.members);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Fetch team requests
  const fetchTeamJoinRequests = useCallback(
    async (teamId) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getJoinRequestsOfTeam(teamId);
        setTeamJoinRequests(data.requests);
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

  // Fetch team members and requests when team changes
  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
      fetchTeamJoinRequests(selectedTeam.id);
    }
  }, [selectedTeam, fetchTeamMembers, fetchTeamJoinRequests]);

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
      } finally {
        setLoading(false);
      }
    },
    [fetchTeams]
  );

  const handleRemoveTeamMembers = useCallback(
    async (teamId, data) => {
      try {
        setLoading(true);
        await removeMembersFromTeam(teamId, data);
        await fetchTeamMembers(teamId);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamMembers]
  );

  const handleUpdateTeamRoleOfMember = useCallback(
    async (teamId, data) => {
      try {
        setLoading(true);
        await updateTeamRoleOfMember(teamId, data);
        await fetchTeamMembers(teamId);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamMembers]
  );

  const handleApproveJoinRequest = useCallback(
    async (requestId) => {
      try {
        setLoading(true);
        await approveJoinRequest(requestId);
        await fetchTeamJoinRequests(selectedTeam.id);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamJoinRequests, selectedTeam]
  );

  const handleRejectJoinRequest = useCallback(
    async (requestId) => {
      try {
        setLoading(true);
        await rejectJoinRequest(requestId);
        await fetchTeamJoinRequests(selectedTeam.id);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchTeamJoinRequests, selectedTeam]
  );

  const contextValue = {
    // State
    teams,
    selectedTeam,
    teamMembers,
    teamJoinRequests,
    loading,
    error,

    // Setters
    setSelectedTeam,

    // Team actions
    handleCreateTeam,
    handleUpdateTeam,
    handleDeleteTeam,
    handleJoinTeam,
    handleLeaveTeam,
    handleRemoveTeamMembers,
    handleUpdateTeamRoleOfMember,
    handleApproveJoinRequest,
    handleRejectJoinRequest
  };

  return <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>;
}
