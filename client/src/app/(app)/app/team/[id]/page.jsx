import TeamWindow from "@/components/team/team-window";

export default async function TeamPage({ params }) {
  const { id } = await params;

  return <TeamWindow teamId={parseInt(id)} />;
}
