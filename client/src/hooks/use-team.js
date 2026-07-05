"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { useSocket } from "@/hooks/use-socket";

const TeamContext = createContext();

export function useTeam() {
  return useContext(TeamContext);
}

export function TeamProvider({ children }) {
  const { user } = useSession();
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const data = await getTeamsOfUser();
      return data.teams;
    },
    enabled: !!user
  });

  const teams = teamsQuery.data ?? [];
  // Re-derive from the cached list on every render so an edit to the selected
  // team (rename, etc.) shows up immediately without a manual re-select.
  const selectedTeam = teams.find((t) => t.id === selectedTeamId) ?? null;

  const setSelectedTeam = useCallback((team) => {
    setSelectedTeamId(team?.id ?? null);
  }, []);

  // Auto-select the first team once teams load, if none selected yet.
  // Uses a functional update (reads the latest state at apply-time, not this
  // render's stale closure) so it can't clobber a team the URL just picked
  // via setSelectedTeam in the same effect flush — a plain `!selectedTeamId`
  // check here raced with TeamSelector's own effect and always lost to
  // whichever ran second, regardless of what the URL said.
  useEffect(() => {
    if (teams.length === 0) return;
    setSelectedTeamId((prev) => (prev !== null ? prev : teams[0].id));
  }, [teams]);

  const teamMembersQuery = useQuery({
    queryKey: ["team-members", selectedTeamId],
    queryFn: async () => {
      const data = await getMembersOfTeam(selectedTeamId);
      return data.members;
    },
    enabled: !!selectedTeamId
  });

  const teamJoinRequestsQuery = useQuery({
    queryKey: ["team-join-requests", selectedTeamId],
    queryFn: async () => {
      const data = await getJoinRequestsOfTeam(selectedTeamId);
      return data.requests;
    },
    enabled: !!selectedTeamId
  });

  const teamMembers = teamMembersQuery.data ?? [];
  const teamJoinRequests = teamJoinRequestsQuery.data ?? [];

  const loading = teamsQuery.isLoading || teamMembersQuery.isLoading || teamJoinRequestsQuery.isLoading;

  // Real-time sync: another member's create/update/delete/membership change
  useEffect(() => {
    if (!socket || !connected) return;

    const handleTeamChanged = (payload) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      if (payload?.team_id) {
        queryClient.invalidateQueries({ queryKey: ["team-members", payload.team_id] });
        queryClient.invalidateQueries({ queryKey: ["team-join-requests", payload.team_id] });
      }
    };

    socket.on("team_changed", handleTeamChanged);

    return () => {
      socket.off("team_changed", handleTeamChanged);
    };
  }, [socket, connected, queryClient]);

  const handleConflict = useCallback(
    async (err, invalidateKeys) => {
      if (err?.status === 409) {
        toast.error(err.message || "This was updated by someone else. Refreshing...");
        await Promise.all(
          invalidateKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))
        );
        return true;
      }
      return false;
    },
    [queryClient]
  );

  // Team actions
  const handleCreateTeam = useCallback(
    async (teamData) => {
      try {
        const newTeam = await createTeam(teamData);
        await queryClient.invalidateQueries({ queryKey: ["teams"] });
        setSelectedTeam(newTeam);
        return newTeam;
      } catch (err) {
        setError(err);
      }
    },
    [queryClient, setSelectedTeam]
  );

  const handleUpdateTeam = useCallback(
    async (teamId, updates) => {
      try {
        const currentTeam = teams.find((t) => t.id === teamId);
        await updateTeam(teamId, { ...updates, updated_at: currentTeam?.updated_at });
        await queryClient.invalidateQueries({ queryKey: ["teams"] });
      } catch (err) {
        const isConflict = await handleConflict(err, [["teams"]]);
        if (!isConflict) setError(err);
      }
    },
    [teams, queryClient, handleConflict]
  );

  const handleDeleteTeam = useCallback(
    async (teamId) => {
      try {
        await deleteTeam(teamId);
        await queryClient.invalidateQueries({ queryKey: ["teams"] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient]
  );

  const handleJoinTeam = useCallback(
    async (code) => {
      try {
        await joinTeam(code);
        await queryClient.invalidateQueries({ queryKey: ["teams"] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient]
  );

  const handleLeaveTeam = useCallback(
    async (teamId) => {
      try {
        await leaveTeam(teamId);
        await queryClient.invalidateQueries({ queryKey: ["teams"] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient]
  );

  const handleRemoveTeamMembers = useCallback(
    async (teamId, data) => {
      try {
        await removeMembersFromTeam(teamId, data);
        await queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient]
  );

  const handleUpdateTeamRoleOfMember = useCallback(
    async (teamId, data) => {
      try {
        await updateTeamRoleOfMember(teamId, data);
        await queryClient.invalidateQueries({ queryKey: ["team-members", teamId] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient]
  );

  const handleApproveJoinRequest = useCallback(
    async (requestId) => {
      try {
        await approveJoinRequest(requestId);
        await queryClient.invalidateQueries({ queryKey: ["team-join-requests", selectedTeam?.id] });
        await queryClient.invalidateQueries({ queryKey: ["team-members", selectedTeam?.id] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient, selectedTeam]
  );

  const handleRejectJoinRequest = useCallback(
    async (requestId) => {
      try {
        await rejectJoinRequest(requestId);
        await queryClient.invalidateQueries({ queryKey: ["team-join-requests", selectedTeam?.id] });
      } catch (err) {
        setError(err);
      }
    },
    [queryClient, selectedTeam]
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
