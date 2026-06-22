import { get } from "@/actions/fetch-client";

export async function getTeams() {
  return get(`/teams`);
}
